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
import CustomBox from "../../../Utils/Containers/CustomBox";
import CustomDrawer from "../../../Utils/Containers/CustomDrawer";
import { MatrixDialog } from "../../../Utils/DataDisplay/MatrixDialog";
import StyledDivider from "../../../Utils/DataDisplay/StyledDivider";
import { CSVDialog } from "../../../Utils/Feedback/CSVDialog";
import { ClassificationDialog } from "../../../Utils/Feedback/DetailsDialog"
import StyledAlert from "../../../Utils/Feedback/StyledAlert";
import CustomButtonGroup from "../../../Utils/Inputs/CustomButtonGroup";
import CustomUpload from "../../../Utils/Inputs/CustomUpload";
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";

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
        const { project, serverBase } = this.props;

        fetchClassification(
            serverBase, project.result.id, "GET", null
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
            if (!error.hasOwnProperty("open")) {
                console.log(error);
            }
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
        const { project, serverBase } = this.props;

        this.setState({
            loading: true,
        }, () => {
            fetchClassification(
                serverBase, project.result.id, method, data
            ).then(result => {
                if (result) {
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
                    let newProject = { ...project }

                    newProject.result.classification = result;
                    newProject.dataUpToDate = result.externalData ?
                        project.dataUpToDate : true;
                    newProject.tabsUpToDate[this.props.value] = result.externalData ?
                        project.tabsUpToDate[this.props.value] : true;
                    newProject.externalData = result.externalData;

                    const resultParameters = parseClassificationParams(result);

                    newProject.parameters = { ...project.parameters, ...resultParameters }
                    newProject.parametersSaved = true;
                    this.props.onTabChange(newProject);
                }
            }).catch(error => {
                if (!error.hasOwnProperty("open")) {
                    console.log(error);
                }
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
                    this.setState({
                        loading: false,
                        selectedItem: null
                    });
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
                let files = { externalDataFile: event.target.files[0] };

                if (!project.dataUpToDate) {
                    files = {
                        ...files,
                        metadata: JSON.stringify(project.result.informationTable.attributes),
                        data: JSON.stringify(project.result.informationTable.objects)
                    };
                }

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
                let files = { externalDataFile: this.csvFile };

                if (!project.dataUpToDate) {
                    files = {
                        ...files,
                        metadata: JSON.stringify(project.result.informationTable.attributes),
                        data: JSON.stringify(project.result.informationTable.objects)
                    };
                }

                let data = createFormData({ ...parameters, ...csvSpecs }, files);

                this.calculateClassification(method, data);
            }
        });
    }

    onSaveToFile = () => {
        const { project, serverBase } = this.props;
        let data = {typeOfMatrix: "classification"};

        downloadMatrix(serverBase, project.result.id, data).catch(error => {
            if (!error.hasOwnProperty("open")) {
                console.log(error);
            }
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
        const { loading, items } = this.state;

        if (!loading && Array.isArray(items) && items.length) {
            const filteredItems = filterFunction(event.target.value.toString(), items.slice());

            this.setState({
                displayedItems: filteredItems,
                selectedItems: null
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
            <CustomBox id={"classification"} variant={"Tab"}>
                <CustomDrawer
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
                </CustomDrawer>
                <CustomBox id={"classification-content"} variant={"TabBody"}>
                    <CustomHeader id={"classification-header"} paperRef={this.upperBar}>
                        <SettingsButton onClick={() => this.toggleOpen("settings")} />
                        <StyledDivider margin={16} />
                        <CustomButtonGroup
                            id={"classification-button-group"}
                            options={["Classify current data", "Choose new data & classify"]}
                            tooltips={"Click on settings button on the left to customize parameters"}
                        >
                            <CalculateButton
                                aria-label={"classify-current-file"}
                                disabled={loading}
                                onClick={this.onClassifyData}
                            >
                                Classify current data
                            </CalculateButton>
                            <CustomUpload
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
                            </CustomUpload>
                        </CustomButtonGroup>
                        {data &&
                        <MatrixButton
                            onClick={() => this.toggleOpen("matrix")}
                            style={{marginLeft: 16}}
                            title={"Show ordinal misclassification matrix and it's details"}
                        />
                        }
                        <span style={{flexGrow: 1}} />
                        <FilterTextField onChange={this.onFilterChange} />
                    </CustomHeader>
                    <TabBody
                        content={parseClassificationListItems(displayedItems)}
                        id={"classification-list"}
                        isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                        isLoading={loading}
                        ListProps={{
                            onItemSelected: this.onDetailsOpen
                        }}
                        ListSubheaderProps={{
                            style: this.upperBar.current ? { top: this.upperBar.current.offsetHeight } : undefined
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
                </CustomBox>
                <StyledAlert {...alertProps} onClose={this.onSnackbarClose} />
            </CustomBox>
        )
    }
}

Classification.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    serverBase: PropTypes.string,
    value: PropTypes.number
};

export default Classification;