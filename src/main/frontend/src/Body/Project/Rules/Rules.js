import React, {Component} from 'react';
import PropTypes from "prop-types";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import TypeOfRulesSelector from "../Utils/Calculations/TypeOfRulesSelector";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTooltip from "../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import { RulesDialog } from "../../../RuleWorkComponents/Feedback/RuleWorkDialog";
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import RuleWorkUpload from "../../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";

class Rules extends Component {
    constructor(props) {
        super(props);

        this._data = {};
        this._items = [];

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            displayedItems: [],
            externalRules: false,
            ruleType: "certain",
            threshold: 0,
            typeOfUnions: "monotonic",
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
        console.log(project);
        this.setState({
            loading: true,
        }, () => {
            let msg, title = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/rules`, {
                method: "GET",
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = this.getItems(result.ruleSet);

                            this._data = result.ruleSet;
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
                            msg = "ERROR " + result.status + " " + result.message;
                            title = "Something went wrong! Couldn't load rules :(";
                            let alertProps = {message: msg, open: true, title: title, severity: "warning"};
                            this.setState({
                                alertProps: result.status !== 404 ? alertProps : undefined
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't load rules :(";
                            title = {title: "ERROR " + response.status};
                            let alertProps = {message: msg, open: true, title: title, severity: "error"};
                            this.setState({
                                alertProps: response.status !== 404 ? alertProps : undefined
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't load rules :( ";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"}
                    });
                }
            }).finally(() => {
                this.setState({
                    loading: false,
                    externalRules: this.props.project.externalRules,
                    ruleType: this.props.project.ruleType,
                    threshold: this.props.project.threshold,
                    typeOfUnions: this.props.project.typeOfUnions
                });
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;

        if (this.state.changes) {
            let project = {...this.props.project};
            if (Object.keys(this._data).length) {
                project.result.ruleSetWithComputableCharacteristics = this._data;
            }
            project.externalRules = this.state.externalRules;
            project.ruleType = this.state.ruleType;
            project.threshold = this.state.threshold;
            project.typeOfUnions = this.state.typeOfUnions;

            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = this.state.updated;

            if (this.state.externalRules) {
                tabsUpToDate[this.props.value] = null;
                tabsUpToDate[this.props.value + 1] = !this.props.project.result.classification;
                tabsUpToDate[this.props.value + 2] = !this.props.project.result.crossValidation;
            }

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

    onCalculateClick = () => {
        this.setState({
            loading: true,
        }, () => {
            let project = {...this.props.project};
            const {ruleType, threshold, typeOfUnions} = this.state;

            let data = new FormData();
            data.append("typeOfUnions", typeOfUnions);
            data.append("consistencyThreshold", threshold);
            data.append("typeOfRules", ruleType);

            if (!project.dataUpToDate) {
                data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
                data.append("data", JSON.stringify(project.result.informationTable.objects));
            }

            let msg, title = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/rules`, {
                method: project.dataUpToDate ? "PUT" : "POST",
                body: data
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        const updated = true;

                        if (this._isMounted) {
                            const items = this.getItems(result.ruleSet);

                            this._data = result.ruleSet;
                            this._items = items;
                            this.setState({
                                changes: true,
                                updated: updated,
                                externalRules: false,
                                displayedItems: items,
                            });
                        } else {
                            project.ruleSetWithComputableCharacteristics = result;
                            project.externalRules = false;

                            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
                            tabsUpToDate[this.props.value] = updated;

                            this.props.onTabChange(project, updated, tabsUpToDate);
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            title = "Something went wrong! Couldn't calculate rules :(";
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "warning"}
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate rules :(";
                            title = "ERROR " + response.status;
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "error"}
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate rules :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"},
                    });
                }
            }).finally(() => {
                if (this._isMounted) this.setState({loading: false});
            });
        });
    };

    onUploadFileChanged = (event) => {
        if (event.target.files[0]) {
            let project = {...this.props.project};

            let data = new FormData();
            data.append("rules", event.target.files[0]);

            this.setState({
                loading: true,
            }, () => {
                let msg, title = "";
                fetch(`http://localhost:8080/projects/${project.result.id}`, {
                    method: "POST",
                    body: data,
                }).then(response => {
                    if (response.status === 200) {
                        response.json().then(result => {
                            if (this._isMounted) {
                                const items = this.getItems(result.rules.ruleSet);

                                this._data = result.rules.ruleSet;
                                this._items = items;
                                this.setState({
                                    changes: true,
                                    updated: this.props.project.dataUpToDate,
                                    externalRules: true,
                                    displayedItems: items,
                                });
                            } else {
                                project.ruleSetWithComputableCharacteristics = result.rules.ruleSet;
                                project.externalRules = true;

                                let tabsUpToDate = this.props.project.tabsUpToDate.slice();
                                tabsUpToDate[this.props.value] = null;
                                tabsUpToDate[this.props.value] = !this.props.project.result.classification;
                                tabsUpToDate[this.props.value] = !this.props.project.result.crossValidation;

                                this.props.onTabChange(project, this.props.project.dataUpToDate, tabsUpToDate);
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    } else {
                        response.json().then(result => {
                            if (this._isMounted) {
                                msg = "error: " + result.status + " " + result.message;
                                title = "Something went wrong. Couldn't upload rules :(";
                                this.setState({
                                    alertProps: {message: msg, open: true, title: title, severity: "warning"}
                                });
                            }
                        }).catch(() => {
                            if (this._isMounted) {
                                msg = "Something went wrong! Couldn't upload rules :(";
                                title = "ERROR " + response.status;
                                this.setState({
                                    alertProps: {message: msg, open: true, title: title, severity: "error"}
                                });
                            }
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    if (this._isMounted) {
                        msg = "Server error! Couldn't upload rules :(";
                        this.setState({
                            alertProps: {message: msg, open: true, severity: "error"}
                        });
                    }
                }).finally(() => {
                    if (this._isMounted) this.setState({loading: false});
                });
            });
        }
    };

    onSaveFileClick = () => {
        const project = this.props.project;
        let msg, title = "";

        fetch(`http://localhost:8080/projects/${project.result.id}/rules/download`, {
            method: "GET",
        }).then(response => {
            if(response.status === 200) {
                const filename =  response.headers.get('Content-Disposition').split('filename=')[1];

                response.blob().then(result => {
                    let url = window.URL.createObjectURL(result);
                    let link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    link.click();
                }).catch(error => {
                    console.log(error);
                });
            } else {
                response.json().then(result => {
                    if (this._isMounted) {
                        msg = "ERROR: " + result.status + " " + result.message;
                        title = "Something went wrong! Couldn't download rules :(";
                        this.setState({
                            alertProps: {message: msg, open: true, title: title, severity: "warning"},
                        });
                    }
                }).catch(() => {
                    msg = "Something went wrong! Couldn't download rules :(";
                    title = "ERROR " + response.status;
                    this.setState({
                        alertProps: {message: msg, open: true, title: title, severity: "error"}
                    })
                });
            }
        }).catch(error => {
            console.log(error);
            if (this._isMounted) {
                msg = "Server error! Couldn't download rules :( ";
                this.setState({
                    alertProps: {message: msg, open: true, severity: "error"},
                });
            }
        });
    };

    onRuleTypeChange = (event) => {
        this.setState({
            changes: event.target.value !== "certain",
            updated: this.props.project.dataUpToDate,
            ruleType: event.target.value
        });
    };

    onThresholdChange = (threshold) => {
        this.setState({
            changes: Boolean(threshold),
            updated: this.props.project.dataUpToDate,
            threshold: threshold,
        });
    };

    onTypeOfUnionsChange = (event) => {
        this.setState({
            changes: event.target.value !== "epsilon",
            updated: this.props.project.dataUpToDate,
            typeOfUnions: event.target.value,
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
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const id = i;
                const name = data[i].rule.decisions[0][0].toString;
                const traits = {...data[i].ruleCharacteristics};
                const tables = {
                    indicesOfCoveredObjects: data[i].indicesOfCoveredObjects.slice(),
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
                    header: this._data[items[i].id].rule.decisions[0][0].toString,
                    subheader: "Type: " + this._data[items[i].id].rule.type.toLowerCase(),
                    content: undefined,
                    multiContent: this._data[items[i].id].rule.conditions.map(condition => (
                        {
                            title: condition.attributeName,
                            subtitle: condition.relationSymbol + " " + condition.limitingEvaluation,
                        }
                    )),
                };
                listItems.push(listItem);
            }
        }
        return listItems;
    };

    render() {
        const { loading, displayedItems, selectedItem, openDetails, openSettings, alertProps } = this.state;
        const { ruleType, threshold, typeOfUnions } = this.state;

        return (
            <RuleWorkBox id={"rule-work-rules"} styleVariant={"tab"}>
                <StyledPaper id={"rules-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"rules-settings-button"}
                        onClick={this.onSettingsClick}
                        title={"Click to choose consistency & type of unions"}
                    />
                    <StyledDivider />
                    <RuleWorkTooltip title={`Calculate with threshold ${threshold}`}>
                        <CalculateButton
                            aria-label={"rules-calculate-button"}
                            disabled={!this.props.project || loading}
                            onClick={this.onCalculateClick}
                        />
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={"Upload file"}>
                        <RuleWorkUpload
                            accept={".xml"}
                            disabled={!this.props.project || loading}
                            id={"rules-upload-button"}
                            onChange={this.onUploadFileChanged}
                        >
                            <StyledButton
                                aria-label={"rules-upload-button"}
                                disabled={!this.props.project || loading}
                                isIcon={true}
                                component={"span"}
                            >
                                <CloudUploadIcon />
                            </StyledButton>
                        </RuleWorkUpload>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={"Save file"}>
                        <StyledButton
                            aria-label={"rules-save-button"}
                            disabled={!this.props.project || !this.state.displayedItems || loading}
                            isIcon={true}
                            onClick={this.onSaveFileClick}
                        >
                            <SaveIcon />
                        </StyledButton>
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <RuleWorkDrawer
                    id={"rules-settings"}
                    open={openSettings}
                    onClose={this.onSettingsClose}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <TypeOfRulesSelector
                        id={"rules-rule-type-selector"}
                        onChange={this.onRuleTypeChange}
                        value={ruleType}
                    />
                    <TypeOfUnionsSelector
                        id={"rules-union-type-selector"}
                        onChange={this.onTypeOfUnionsChange}
                        value={typeOfUnions}
                    />
                    <ThresholdSelector
                        id={"rules-threshold-selector"}
                        onChange={this.onThresholdChange}
                        value={threshold}
                    />
                </RuleWorkDrawer>
                <TabBody
                    content={this.getListItems(displayedItems)}
                    id={"rules-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onDetailsOpen
                    }}
                    noFilterResults={!displayedItems}
                    subheaderContent={[
                        {
                            label: "Number of objects",
                            value: displayedItems && displayedItems.length
                        }
                    ]}
                />
                {selectedItem &&
                    <RulesDialog
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

Rules.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    value: PropTypes.number,
};

export default Rules;