import React, {Component} from 'react';
import PropTypes from "prop-types";
import { parseRulesItems, parseRulesListItems } from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import TypeOfRulesSelector from "../Utils/Calculations/TypeOfRulesSelector";
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

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            data: null,
            items: null,
            displayedItems: [],
            externalRules: false,
            parameters: {
                consistencyThreshold: 0,
                typeOfRules: "certain",
                typeOfUnions: "monotonic"
            },
            selectedItem: null,
            open: {
                details: false,
                settings: false
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
            fetch(`http://localhost:8080/projects/${project.result.id}/rules`, {
                method: "GET",
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = parseRulesItems(result);

                            this.setState({
                                data: result,
                                items: items,
                                displayedItems: items,
                                parameters: {
                                    consistencyThreshold: result.consistencyThreshold,
                                    typeOfRules: result.typeOfRules.toLowerCase(),
                                    typeOfUnions: result.typeOfUnions.toLowerCase()
                                }
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
                if (this._isMounted) {
                    this.setState({
                        loading: false,
                        externalRules: this.props.project.externalRules,
                        parameters: {
                            consistencyThreshold: this.props.project.threshold,
                            typeOfRules: this.props.project.ruleType,
                            typeOfUnions: this.props.project.typeOfUnions
                        },
                    });
                }
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;

        const {
            changes,
            updated,
            data,
            externalRules,
            parameters: {
                consistencyThreshold,
                typeOfRules,
                typeOfUnions
            }
        } = this.state;

        if (changes) {
            let project = {...this.props.project};

            project.result.rules = data;
            project.externalRules = externalRules;
            project.threshold = consistencyThreshold;
            project.ruleType = typeOfRules;
            project.typeOfUnions = typeOfUnions;

            let tabsUpToDate = project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = updated;

            if (externalRules) {
                tabsUpToDate[this.props.value] = null;
                tabsUpToDate[this.props.value + 1] = !project.result.classification;
            }

            this.props.onTabChange(project, updated, tabsUpToDate);
        }
    }

    onCalculateClick = () => {
        this.setState({
            loading: true,
        }, () => {
            let project = {...this.props.project};
            const { parameters } = this.state;

            let data = new FormData();
            Object.keys(parameters).map(key => {
                data.append(key, parameters[key]);
            });

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
                            const items = parseRulesItems(result);

                            this.setState({
                                changes: true,
                                updated: updated,
                                externalRules: false,
                                data: result,
                                items: items,
                                displayedItems: items,
                            });
                        } else {
                            project.result.rules = result;
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
                                const items = parseRulesItems(result.rules);

                                this.setState({
                                    changes: true,
                                    updated: project.dataUpToDate,
                                    externalRules: true,
                                    data: result,
                                    items: items,
                                    displayedItems: items,
                                });
                            } else {
                                project.result.rules = result.rules;
                                project.externalRules = true;

                                let tabsUpToDate = project.tabsUpToDate.slice();
                                tabsUpToDate[this.props.value] = null;
                                tabsUpToDate[this.props.value] = !project.result.classification;

                                this.props.onTabChange(project, project.dataUpToDate, tabsUpToDate);
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

    onConsistencyThresholdChange = (threshold) => {
        this.setState(({parameters}) => ({
            changes: Boolean(threshold),
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, consistencyThreshold: threshold},
        }));
    };

    onTypeOfRulesChange = (event) => {
        this.setState(({parameters}) => ({
            changes: event.target.value !== "certain",
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, typeOfRules: event.target.value},
        }));
    };

    onTypeOfUnionsChange = (event) => {
        this.setState(({parameters}) => ({
            changes: event.target.value !== "epsilon",
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, typeOfUnions: event.target.value},
        }));
    };

    onFilterChange = (event) => {
        const { items } = this.state;
        const filteredItems = filterFunction(event.target.value.toString(), items.slice());

        this.setState({
            displayedItems: filteredItems
        });
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
            parameters: { consistencyThreshold, typeOfRules, typeOfUnions},
            selectedItem,
            open,
            alertProps
        } = this.state;

        return (
            <RuleWorkBox id={"rule-work-rules"} styleVariant={"tab"}>
                <StyledPaper id={"rules-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"rules-settings-button"}
                        onClick={() => this.toggleOpen("settings")}
                        title={"Click to choose consistency & type of unions"}
                    />
                    <StyledDivider />
                    <RuleWorkTooltip title={`Calculate with threshold ${consistencyThreshold}`}>
                        <CalculateButton
                            aria-label={"rules-calculate-button"}
                            disabled={loading}
                            onClick={this.onCalculateClick}
                        />
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={"Upload file"}>
                        <RuleWorkUpload
                            accept={".xml"}
                            disabled={loading}
                            id={"rules-upload-button"}
                            onChange={this.onUploadFileChanged}
                        >
                            <StyledButton
                                aria-label={"rules-upload-button"}
                                disabled={loading}
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
                            disabled={!Boolean(data) || loading}
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
                    open={open.settings}
                    onClose={() => this.toggleOpen("settings")}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <TypeOfRulesSelector
                        id={"rules-rule-type-selector"}
                        onChange={this.onTypeOfRulesChange}
                        value={typeOfRules}
                    />
                    <TypeOfUnionsSelector
                        id={"rules-union-type-selector"}
                        onChange={this.onTypeOfUnionsChange}
                        value={typeOfUnions}
                    />
                    <ThresholdSelector
                        id={"rules-threshold-selector"}
                        onChange={this.onConsistencyThresholdChange}
                        value={consistencyThreshold}
                    />
                </RuleWorkDrawer>
                <TabBody
                    content={parseRulesListItems(displayedItems)}
                    id={"rules-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onDetailsOpen
                    }}
                    noFilterResults={!displayedItems}
                    subheaderContent={[
                        {
                            label: "Number of rules",
                            value: displayedItems && displayedItems.length
                        }
                    ]}
                />
                {selectedItem &&
                    <RulesDialog
                        item={selectedItem}
                        onClose={() => this.toggleOpen("details")}
                        open={open.details}
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