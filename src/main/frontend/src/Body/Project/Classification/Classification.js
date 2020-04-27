import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    createFormData,
    downloadMatrix,
    fetchClassification,
    parseClassificationParams
} from "../Utils/fetchFunctions";
import {
    parseClassificationItems,
    parseClassificationListItems,
    parseMatrix
} from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import MatrixButton from "../Utils/Buttons/MatrixButton";
import MatrixDownloadButton from "../Utils/Buttons/MatrixDownloadButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import DefaultClassificationResultSelector from "../Utils/Calculations/DefaultClassificationResultSelector";
import TypeOfClassifierSelector from "../Utils/Calculations/TypeOfClassifierSelector";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer";
import { MatrixDialog } from "../../../RuleWorkComponents/DataDisplay/MatrixDialog";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import { CSVDialog } from "../../../RuleWorkComponents/Feedback/CSVDialog";
import { ClassificationDialog } from "../../../RuleWorkComponents/Feedback/RuleWorkDialog"
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import RuleWorkButtonGroup from "../../../RuleWorkComponents/Inputs/RuleWorkButtonGroup";
import RuleWorkUpload from "../../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";

class Classification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
            items: null,
            displayedItems: [],
            externalData: false,
            parameters: {
                defaultClassificationResult: "majorityDecisionClass",
                typeOfClassifier: "SimpleRuleClassifier",
            },
            parametersSaved: true,
            selectedItem: null,
            open: {
                details: false,
                matrix: false,
                settings: false,
                csv: false
            },
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    getClassification = () => {
        const { project } = this.props;

        fetchClassification(
            project.result.id, "GET", null
        ).then(result => {
            if (result && this._isMounted) {
                const { project: { parametersSaved, settings } } = this.props;

                const items = parseClassificationItems(result, settings);
                const resultParameters = parseClassificationParams(result);

                this.setState(({parameters}) => ({
                    data: result,
                    items: items,
                    displayedItems: items,
                    externalData: result.externalData,
                    parameters: { ...parameters, ...resultParameters },
                    parametersSaved: parametersSaved
                }));
            }
        }).catch(error => {
            if (this._isMounted) {
                this.setState({
                    data: null,
                    items: null,
                    displayedItems: [],
                    alertProps: error
                });
            }
        }).finally(() => {
            if (this._isMounted) {
                const { parametersSaved } = this.state;
                const { project: { parameters: {
                    defaultClassificationResult,
                    typeOfClassifier
                }}} = this.props;

                this.setState(({parameters}) => ({
                    loading: false,
                    parameters: parametersSaved ?
                        parameters : { ...parameters, ...{ defaultClassificationResult, typeOfClassifier } },
                    selectedItem: null
                }));
            }
        });
    }

    componentDidMount() {
        this._isMounted = true;

        this.setState({ loading: true }, this.getClassification);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.project.settings.indexOption !== prevProps.project.settings.indexOption) {
            const { data } = this.state;
            const { project } = this.props;

            let newItems = parseClassificationItems(data, project.settings);

            this.setState({
                items: newItems,
                displayedItems: newItems
            });
        }

        if (prevProps.project.result.id !== this.props.project.result.id) {
            const { parametersSaved } = prevState;

            if (!parametersSaved) {
                let project = { ...prevProps.project };
                const { parameters } = prevState;

                project.parameters = { ...project.parameters, ...parameters};
                project.parametersSaved = parametersSaved;
                this.props.onTabChange(project);
            }

            this.setState({ loading: true }, this.getClassification);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        const { parametersSaved } = this.state;

        if (!parametersSaved) {
            let project = {...this.props.project};
            const { parameters } = this.state;

            project.parameters = { ...project.parameters, ...parameters };
            project.parametersSaved = parametersSaved;
            this.props.onTabChange(project);
        }
    }

    calculateClassification = (method, data) => {
        let project = {...this.props.project};

        this.setState({
            loading: true,
        }, () => {
            fetchClassification(
                project.result.id, method, data
            ).then(result => {
                if (result) {
                    project = {...this.props.project};

                    if (this._isMounted) {
                        const items = parseClassificationItems(result, project.settings);

                        this.setState({
                            data: result,
                            items: items,
                            displayedItems: items,
                            externalData: result.externalData,
                            parametersSaved: true,
                        });
                    }

                    project.result.classification = result;
                    project.dataUpToDate = result.externalData ?
                        project.dataUpToDate : true;
                    project.tabsUpToDate[this.props.value] = result.externalData ?
                        project.tabsUpToDate[this.props.value] : true;
                    project.externalData = result.externalData;

                    const resultParameters = parseClassificationParams(result);

                    project.parameters = { ...project.parameters, ...resultParameters}
                    project.parametersSaved = true;
                    this.props.onTabChange(project);
                }
            }).catch(error => {
                if (this._isMounted) {
                    this.setState({alertProps: error});
                }
            }).finally(() => {
                if (this._isMounted) {
                    this.setState({loading: false});
                }
            });
        });
    }

    onClassifyData = () => {
        const { project } = this.props;
        const { parameters } = this.state;

        let method = project.dataUpToDate ? "PUT" : "POST";
        let files = {
            metadata: JSON.stringify(project.result.informationTable.attributes),
            data: JSON.stringify(project.result.informationTable.objects)
        }
        let data = createFormData(parameters, project.dataUpToDate ? null : files);

        this.calculateClassification(method, data);
    };

    onUploadData = (event) => {
        event.persist();

        if (event.target.files) {
            if (event.target.files[0].type !== "application/json") {
                this.csvFile = event.target.files[0];

                this.setState(({open}) => ({
                    open: { ...open, csv: true }
                }));
            } else {
                const { project } = this.props;
                const { parameters } = this.state;

                let method = project.dataUpToDate ? "PUT" : "POST";
                let files = { data: event.target.files[0] };
                let data = createFormData(parameters, files);

                this.calculateClassification(method, data);
            }
        }
    };

    onCSVDialogClose = (csvSpecs) => {
        this.setState(({open}) => ({
            open: { ...open, csv: false }
        }), () => {
            if (csvSpecs && Object.keys(csvSpecs).length) {
                const { project } = this.props;
                const { parameters } = this.state;

                let method = project.dataUpToDate ? "PUT" : "POST";
                let files = { data: this.csvFile };
                let data = createFormData(parameters, files);

                this.calculateClassification(method, data);
            }
        });
    }

    onSaveToFile = () => {
        const { project } = this.props;
        let data = {typeOfMatrix: "classification"}

        downloadMatrix( project.result.id, data ).catch(error => {
            if (this._isMounted) {
                this.setState({ alertProps: error });
            }
        });
    };

    onDefaultClassificationResultChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, defaultClassificationResult: event.target.value},
                parametersSaved: false
            }));
        }
    };

    onClassifierTypeChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, typeOfClassifier: event.target.value},
                parametersSaved: false
            }));
        }
    };

    onFilterChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            const { items } = this.state;
            const filteredItems = filterFunction(event.target.value.toString(), items.slice());

            this.setState({
                displayedItems: filteredItems
            });
        }
    };

    toggleOpen = (name) => {
        this.setState(({open}) => ({
            open: {...open, [name]: !open[name]}
        }));
    };

    onDetailsOpen = (index) => {
        const { items } = this.state;

        this.setState(({open}) => ({
            open: {...open, details: true, settings: false},
            selectedItem: items[index]
        }));
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    render() {
        const { loading, data, displayedItems, parameters, selectedItem, open, alertProps } = this.state;
        const { project } = this.props;

        return (
            <RuleWorkBox id={"rule-work-classification"} styleVariant={"tab"}>
                <StyledPaper id={"classification-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"classification-settings-button"}
                        onClick={() => this.toggleOpen("settings")}
                        title={"Click to select parameters"}
                    />
                    <StyledDivider margin={16} />
                    <RuleWorkButtonGroup
                        id={"classification-button-group"}
                        options={["Classify current data", "Choose new data & classify"]}
                    >
                        <CalculateButton
                            aria-label={"classify-current-file"}
                            disabled={loading}
                            onClick={this.onClassifyData}
                        >
                            Classify current data
                        </CalculateButton>
                        <RuleWorkUpload
                            accept={".json,.csv"}
                            id={"classify-new-file"}
                            onChange={this.onUploadData}
                        >
                            <CalculateButton
                                aria-label={"classify-new-file"}
                                disabled={loading}
                                component={"span"}
                            >
                                Choose new data & classify
                            </CalculateButton>
                        </RuleWorkUpload>
                    </RuleWorkButtonGroup>
                    {data &&
                        <MatrixButton
                            onClick={() => this.toggleOpen("matrix")}
                            style={{marginLeft: 16}}
                            title={"Show ordinal misclassification matrix and it's details"}
                        />
                    }
                    <span style={{flexGrow: 1}} />
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <RuleWorkDrawer
                    id={"classification-settings"}
                    open={open.settings}
                    onClose={() => this.toggleOpen("settings")}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <TypeOfClassifierSelector
                        TextFieldProps={{
                            onChange: this.onClassifierTypeChange,
                            value: parameters.typeOfClassifier
                        }}
                    />
                    <DefaultClassificationResultSelector
                        TextFieldProps={{
                            onChange: this.onDefaultClassificationResultChange,
                            value: parameters.defaultClassificationResult
                        }}
                    />
                </RuleWorkDrawer>
                <TabBody
                    content={parseClassificationListItems(displayedItems)}
                    id={"classification-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onDetailsOpen
                    }}
                    noFilterResults={!displayedItems}
                    subheaderContent={[
                        {
                            label: "Number of objects:",
                            value: displayedItems && displayedItems.length,
                        }
                    ]}
                />
                {project.result.rules !== null && selectedItem !== null &&
                    <ClassificationDialog
                        item={selectedItem}
                        onClose={() => this.toggleOpen("details")}
                        open={open.details}
                        ruleSet={project.result.rules.ruleSet}
                    />
                }
                {data !== null &&
                    <MatrixDialog
                        matrix={parseMatrix(data.ordinalMisclassificationMatrix)}
                        onClose={() => this.toggleOpen("matrix")}
                        open={open.matrix}
                        subheaders={data.decisionsDomain}
                        saveMatrix={this.onSaveToFile}
                        title={
                            <React.Fragment>
                                <MatrixDownloadButton
                                    onSave={this.onSaveToFile}
                                    tooltip={"Download matrix (txt)"}
                                />
                                <span aria-label={"matrix title"} style={{paddingLeft: 8}}>
                                    Ordinal misclassification matrix and details
                                </span>
                            </React.Fragment>
                        }
                    />
                }
                <CSVDialog onConfirm={this.onCSVDialogClose} open={open.csv} />
                <RuleWorkAlert {...alertProps} onClose={this.onSnackbarClose} />
            </RuleWorkBox>
        )
    }
}

Classification.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    value: PropTypes.number,
};

export default Classification;