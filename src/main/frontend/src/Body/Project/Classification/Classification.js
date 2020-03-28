import React, {Component} from "react";
import PropTypes from "prop-types";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterNoResults from "../Utils/Filtering/FilterNoResults";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Calculations/CalculateButton";
import SettingsButton from "../Utils/Settings/SettingsButton";
import SettingsFooter from "../Utils/Settings/SettingsFooter";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkDialog from "../../../RuleWorkComponents/Feedback/RuleWorkDialog/RuleWorkDialog"
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import RuleWorkButtonGroup from "../../../RuleWorkComponents/Inputs/RuleWorkButtonGroup";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import RuleWorkUpload from "../../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";

class Classification extends Component {
    constructor(props) {
        super(props);

        this._data = {};
        this._items = [];

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            displayedItems: [],
            ruleType: "certain",
            typeOfClassifier: "SimpleRuleClassifier",
            defaultClassificationResult: "majorityDecisionClass",
            selectedItem: null,
            openDetails: false,
            openSettings: false,
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        const project = {...this.props.project};

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
            project.ruleType = this.state.ruleType;
            project.typeOfClassifier = this.state.typeOfClassifier;
            project.defaultClassificationResult = this.state.defaultClassificationResult;

            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = this.state.updated;

            this.props.onTabChange(project, this.state.updated, tabsUpToDate);
        }
    }

    onSettingsClick = () => {
        this.setState(prevState => ({
            openSettings: !prevState.openSettings,
        }));
    };

    onSettingsClose = () => {
        this.setState({
            openSettings: false,
        });
    };

    onCalculateClick = (event) => {
        event.persist();
        let project = {...this.props.project};

        let data = new FormData();
        data.append("typeOfClassifier", this.state.typeOfClassifier);
        data.append("defaultClassificationResult", this.state.defaultClassificationResult);
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
                method: project.dataUpToDate ? "PUT" : "POST",
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

    onRuleTypeChange = (event) => {
        this.setState({
            changes: event.target.value !== "certain",
            updated: this.props.project.dataUpToDate,
            ruleType: event.target.value,
        });
    };

    onFilterChange = (event) => {
        const filteredItems = filterFunction(event.target.value.toString(), this._items.slice(0));
        this.setState({displayedItems: filteredItems});
    };

    onDetailsOpen = (index) => {
        this.setState({
            openDetails: true,
            selectedItem: this._items[index]
        });
    };

    onDetailsClose = () => {
        this.setState({
            openDetails: false
        });
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
                    values: {...data.informationTable.objects[i]}
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
        if (this._data) {

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
        const {loading, displayedItems, ruleType, selectedItem, openDetails,
            openSettings, alertProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-classification"} styleVariant={"tab"}>
                <StyledPaper id={"classification-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"classification-settings-button"}
                        onClick={this.onSettingsClick}
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
                    <span style={{flexGrow: 1}} />
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <RuleWorkDrawer
                    height={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                    id={"classification-settings-drawer"}
                    open={openSettings}
                >
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"rule-type-selector"}>
                        <RuleWorkTextField
                            disabledChildren={["possible"]}
                            onChange={this.onRuleTypeChange}
                            outsideLabel={"Choose rule type"}
                            select={true}
                            value={ruleType}
                        >
                            {["certain", "possible"]}
                        </RuleWorkTextField>
                    </RuleWorkSmallBox>
                    <SettingsFooter
                        id={"classification-settings-footer"}
                        onClose={this.onSettingsClose}
                    />
                </RuleWorkDrawer>
                <RuleWorkBox id={"classification-body"} styleVariant={"tab-body"} >
                    {loading ?
                        <StyledCircularProgress />
                        :
                        displayedItems ?
                            <RuleWorkList onItemSelected={this.onDetailsOpen}>
                                {this.getListItems(displayedItems)}
                            </RuleWorkList>
                            :
                            <FilterNoResults />
                    }
                </RuleWorkBox>
                {selectedItem &&
                    <RuleWorkDialog
                        item={selectedItem}
                        onClose={this.onDetailsClose}
                        open={openDetails}
                        projectResult={this.props.project.result}
                    />
                }
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