import React, { Component } from "react";
import PropTypes from "prop-types";
import { parseClassificationItems, parseClassificationListItems, parseMatrixTraits } from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import MatrixButton from "../Utils/Buttons/MatrixButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import DefaultClassificationResultSelector from "../Utils/Calculations/DefaultClassificationResultSelector";
import TypeOfClassifierSelector from "../Utils/Calculations/TypeOfClassifierSelector";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import MatrixDialog from "../../../RuleWorkComponents/DataDisplay/MatrixDialog";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import { ClassificationDialog } from "../../../RuleWorkComponents/Feedback/RuleWorkDialog"
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import RuleWorkButtonGroup from "../../../RuleWorkComponents/Inputs/RuleWorkButtonGroup";
import RuleWorkUpload from "../../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";

class Classification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            data: null,
            items: null,
            displayedItems: [],
            parameters: {
                defaultClassificationResult: "majorityDecisionClass",
                typeOfClassifier: "SimpleRuleClassifier",
            },
            selectedItem: null,
            open: {
                details: false,
                matrix: false,
                settings: false,
            },
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        const { project } = this.props;

        this.setState({
            loading: true,
        }, () => {
            let msg, title = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/classification`, {
                method: "GET"
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = parseClassificationItems(result, project.settings);

                            this.setState({
                                data: result,
                                items: items,
                                displayedItems: items,
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            title = "Something went wrong! Couldn't load classification :(";
                            let alertProps = {message: msg, open: true, title: title, severity: "warning"};
                            this.setState({
                                alertProps: result.status !== 404 ? alertProps : undefined
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't load classification :(";
                            title = "ERROR " + response.status;
                            let alertProps = {message: msg, open: true, title: title, severity: "error"};
                            this.setState({
                                alertProps: response.status !== 404 ? alertProps : undefined,
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't load classification :(";
                    this.setState({
                        alertProps: {message: msg, open: true, variant: "error"}
                    });
                }
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({parameters}) => ({
                        loading: false,
                        parameters: Object.keys(parameters).map(key => {
                            return { [key]: this.props.project[key] }
                        }).reduce((previousValue, currentValue) => {
                            return { ...previousValue, ...currentValue }
                        }),
                    }));
                }
            });
        });
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
    }

    componentWillUnmount() {
        this._isMounted = false;

        const { changes, updated, data, parameters } = this.state;

        if (changes) {
            let project = {...this.props.project};

            project.result.classification = data;
            Object.keys(parameters).map(key => { project[key] = parameters[key] });

            let tabsUpToDate = project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = updated;

            this.props.onTabChange(project, updated, tabsUpToDate);
        }
    }

    onCalculateClick = (event) => {
        event.persist();
        let project = {...this.props.project};
        const { parameters: { defaultClassificationResult, typeOfClassifier } } = this.state;

        let data = new FormData();
        data.append("defaultClassificationResult", defaultClassificationResult);
        data.append("typeOfClassifier", typeOfClassifier);
        if (event.target.files) data.append("data", event.target.files[0]);
        if (!project.dataUpToDate && !event.target.files) {
            data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
            data.append("data", JSON.stringify(project.result.informationTable.objects));
        }

        this.setState({
            loading: true,
        }, () => {
            let msg, title = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/classification`, {
                method: project.dataUpToDate || event.target.files ? "PUT" : "POST",
                body: data,
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        const updated = true;

                        if (this._isMounted) {
                            const items = parseClassificationItems(result, project.settings);

                            this.setState({
                                changes: true,
                                updated: updated,
                                data: result,
                                items: items,
                                displayedItems: items,
                            });
                        } else {
                            project.result.classification = result;

                            let tabsUpToDate = project.tabsUpToDate.slice();
                            tabsUpToDate[this.props.value] = updated;

                            this.props.onTabChange(project, updated, tabsUpToDate);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            title = "Something went wrong! Couldn't calculate classification :(";
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "warning"}
                            })
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate classification :(";
                            title = "ERROR " + response.status;
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "error"}
                            });
                        }
                    })
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate classification :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"}
                    });
                }
            }).finally(() => {
                if (this._isMounted) this.setState({loading: false});
            });
        });
    };

    onDefaultClassificationResultChange = (event) => {
        this.setState(({parameters}) => ({
            changes: event.target.value !== "majorityDecisionClass",
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, defaultClassificationResult: event.target.value}
        }));
    };

    onClassifierTypeChange = (event) => {
        this.setState(({parameters}) => ({
            changes: event.target.value !== "SimpleRuleClassifier",
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, typeOfClassifier: event.target.value}
        }));
    };

    onFilterChange = (event) => {
        const { items } = this.state;
        const filteredItems = filterFunction(event.target.value.toString(), items.slice());

        this.setState({
            displayedItems: filteredItems
        });
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
        const {
            loading,
            data,
            displayedItems,
            parameters: { defaultClassificationResult, typeOfClassifier },
            selectedItem,
            open,
            alertProps
        } = this.state;

        return (
            <RuleWorkBox id={"rule-work-classification"} styleVariant={"tab"}>
                <StyledPaper id={"classification-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"classification-settings-button"}
                        onClick={() => this.toggleOpen("settings")}
                        title={"Click to choose rule type"}
                    />
                    <StyledDivider />
                    <RuleWorkButtonGroup
                        id={"classification-button-group"}
                        options={["Classify current data", "Choose new data & classify"]}
                    >
                        <CalculateButton
                            aria-label={"classify-current-file"}
                            disabled={loading}
                            onClick={this.onCalculateClick}
                        >
                            Classify current data
                        </CalculateButton>
                        <RuleWorkUpload
                            accept={".json,.csv"}
                            id={"classify-new-file"}
                            onChange={this.onCalculateClick}
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
                        id={"classification-classifier-type-selector"}
                        onChange={this.onClassifierTypeChange}
                        value={typeOfClassifier}
                    />
                    <DefaultClassificationResultSelector
                        id={"classification-default-classification-result-selector"}
                        onChange={this.onDefaultClassificationResultChange}
                        value={defaultClassificationResult}
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
                            label: "Number of objects",
                            value: displayedItems && displayedItems.length,
                        }
                    ]}
                />
                {selectedItem &&
                    <ClassificationDialog
                        item={selectedItem}
                        onClose={() => this.toggleOpen("details")}
                        open={open.details}
                        ruleSet={this.props.project.result.rules.ruleSet}
                    />
                }
                <RuleWorkAlert {...alertProps} onClose={this.onSnackbarClose} />
                {data &&
                    <MatrixDialog
                        matrix={parseMatrixTraits(data.ordinalMisclassificationMatrix)}
                        onClose={() => this.toggleOpen("matrix")}
                        open={open.matrix}
                        title={"Ordinal misclassification matrix and it's details"}
                    />
                }
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