import React, {Component} from "react";
import PropTypes from "prop-types";
import { parseMatrixTraits } from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import MatrixButton from "../Utils/Buttons/MatrixButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import DefaultClassificationResultSelector from "../Utils/Calculations/DefaultClassificationResultSelector";
import TypeOfClassifierSelector from "../Utils/Calculations/TypeOfClassifierSelector";
import Item from "../../../RuleWorkComponents/API/Item";
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

        this._data = null;
        this._items = null;

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            displayedItems: [],
            defaultClassificationResult: "majorityDecisionClass",
            ruleType: "certain",
            typeOfClassifier: "SimpleRuleClassifier",
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
                            const items = this.getItems(result);

                            this._data = result;
                            this._items = items;
                            this.setState({
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
                this.setState({
                    loading: false,
                    defaultClassificationResult: this.props.project.defaultClassificationResult,
                    ruleType: this.props.project.ruleType,
                    typeOfClassifier: this.props.project.typeOfClassifier
                });
            });
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.project.settings.indexOption !== prevProps.project.settings.indexOption) {
            this.setState({
                displayedItems: [...this.getItems(this._data)]
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;

        if (this.state.changes) {
            let project = {...this.props.project};
            if (Object.keys(this._data).length) {
                project.result.classification = this._data;
            }

            project.defaultClassificationResult = this.state.defaultClassificationResult;
            project.ruleType = this.state.ruleType;
            project.typeOfClassifier = this.state.typeOfClassifier;

            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = this.state.updated;

            this.props.onTabChange(project, this.state.updated, tabsUpToDate);
        }
    }

    onCalculateClick = (event) => {
        event.persist();
        let project = {...this.props.project};
        const { defaultClassificationResult, ruleType, typeOfClassifier } = this.state;

        let data = new FormData();
        data.append("defaultClassificationResult", defaultClassificationResult);
        data.append("typeOfRules", ruleType);
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
                            const items = this.getItems(result);

                            this._data = result;
                            this._items = items;
                            this.setState({
                                changes: true,
                                updated: updated,
                                displayedItems: items,
                            });
                        } else {
                            project.result.classification = result;

                            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
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
        this.setState({
            changes: event.target.value !== "majorityDecisionClass",
            updated: this.props.project.dataUpToDate,
            defaultClassificationResult: event.target.value
        });
    };

    onClassifierTypeChange = (event) => {
        this.setState({
            changes: event.target.value !== "SimpleRuleClassifier",
            updated: this.props.project.dataUpToDate,
            typeOfClassifier: event.target.value
        });
    };

    onFilterChange = (event) => {
        const filteredItems = filterFunction(event.target.value.toString(), this._items.slice(0));
        this.setState({displayedItems: filteredItems});
    };

    toggleOpen = (name) => {
        this.setState(({open}) => ({
            open: {...open, [name]: !open[name]}
        }));
    };

    onDetailsOpen = (index) => {
        this.setState(({open}) => ({
            open: {...open, details: true},
            selectedItem: this._items[index]
        }));
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    getItems = (data) => {
        let items = [];
        if (Object.keys(data).length) {
            const indexOption = this.props.project.settings.indexOption;
            const objects = this.props.project.result.informationTable.objects.slice();

            for (let i = 0; i < data.classificationResults.length; i++) {
                const id = i;
                let name = "Object " + (i + 1);

                if (indexOption !== "default") {
                    if (Object.keys(objects[i]).includes(indexOption)) {
                        name = objects[i][indexOption];
                    }
                }

                const traits = {
                    attributes: data.informationTable.attributes.slice(),
                    objects: data.informationTable.objects.slice()
                };
                const tables = {
                    indicesOfCoveringRules: data.indicesOfCoveringRules[i].slice()
                };
                const item = new Item(id, name, traits, null, tables);
                items.push(item);
            }
        }
        return items;
    };

    getListItems = (items) => {
        let listItems = [];
        if (this._data && items) {

            for (let i = 0; i < items.length; i++) {
                const listItem = {
                    id: items[i].id,
                    header: items[i].name,
                    subheader: "Suggested decision: " + this._data.classificationResults[items[i].id].suggestedDecision,
                    content: "Is covered by " + items[i].tables.indicesOfCoveringRules.length + " rules"
                };
                listItems.push(listItem)
            }
        }
        return listItems;
    };

    render() {
        const { loading, displayedItems, selectedItem, open, alertProps } = this.state;
        const { defaultClassificationResult, typeOfClassifier } = this.state;

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
                            disabled={!this.props.project || loading}
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
                                disabled={!this.props.project || loading}
                                component={"span"}
                            >
                                Choose new data & classify
                            </CalculateButton>
                        </RuleWorkUpload>
                    </RuleWorkButtonGroup>
                    {this._data &&
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
                    content={this.getListItems(displayedItems)}
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
                {this._data &&
                    <MatrixDialog
                        matrix={parseMatrixTraits(this._data.ordinalMisclassificationMatrix)}
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