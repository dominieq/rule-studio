import React, {Component} from 'react';
import PropTypes from "prop-types";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterNoResults from "../Utils/Filtering/FilterNoResults";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Calculations/CalculateButton";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import SettingsButton from "../Utils/Settings/SettingsButton";
import SettingsFooter from "../Utils/Settings/SettingsFooter";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTooltip from "../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import RuleWorkDialog from "../../../RuleWorkComponents/Feedback/RuleWorkDialog/RuleWorkDialog"
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
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
            threshold: 0,
            typeOfUnions: "monotonic",
            selectedItem: null,
            openDetails: false,
            openSettings: false,
            snackbarProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        const project = {...this.props.project};

        this.setState({
            loading: true,
        }, () => {
            let msg = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/rules`, {
                method: "GET",
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = this.getItems(result);

                            this._data = result;
                            this._items = items;
                            this.setState({
                                loading: false,
                                displayedItems: items,
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + " " + result.message;
                            let alertProps = {title: "Something went wrong! Couldn't load rules :("};
                            let snackbarProps = {alertProps: alertProps, open: true, message: msg, variant: "warning"};
                            this.setState({
                                loading: false,
                                snackbarProps: result.status !== 404 ? snackbarProps : undefined
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted){
                            msg = "Something went wrong! Couldn't load rules :(";
                            let alertProps = {title: "ERROR " + response.status};
                            let snackbarProps = {alertProps: alertProps, open: true, message: msg, variant: "error"};
                            this.setState({
                                loading: false,
                                snackbarProps: response.status !== 404 ? snackbarProps : undefined
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't load rules :( " + error.message;
                    this.setState({
                        loading: false,
                        snackbarProps: {open: true, message: msg, variant: "error"},
                    });
                }
            }).finally(() => {
                this.setState({
                    loading: false,
                    externalRules: this.props.project.externalRules,
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

    onCalculateClick = () => {
        let project = {...this.props.project};
        const threshold = this.state.threshold;
        const typeOfUnions = this.state.typeOfUnions;

        this.setState({
            loading: true,
        }, () => {
            let link = `http://localhost:8080/projects/${project.result.id}/rules`;
            if (project.dataUpToDate) link = link + `?typeOfUnions=${typeOfUnions}&consistencyThreshold=${threshold}`;

            let data = new FormData();
            data.append("typeOfUnions", typeOfUnions);
            data.append("consistencyThreshold", threshold);
            data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
            data.append("data", JSON.stringify(project.result.informationTable.objects));

            let msg = "";
            fetch(link, {
                method: project.dataUpToDate ? "PUT" : "POST",
                body: project.dataUpToDate ? null : data
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
                                externalRules: false,
                                loading: false,
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
                        if (this._isMounted) this.setState({loading: false});
                    })
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            let alertProps = {title: "Something went wrong! Couldn't calculate rules :("};
                            this.setState({
                                loading: false,
                                snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "warning"}
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate rules :(";
                            let alertProps = {title: "ERROR " + response.status};
                            this.setState({
                                loading: false,
                                snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "error"}
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate rules :(";
                    this.setState({
                        loading: false,
                        snackbarProps: {open: true, message: msg, variant: "error"},
                    });
                }
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
                let msg = "";
                fetch(`http://localhost:8080/projects/${project.result.id}`, {
                    method: "POST",
                    body: data,
                }).then(response => {
                    if (response.status === 200) {
                        response.json().then(result => {
                            if (this._isMounted) {
                                const items = this.getItems(result.ruleSetWithComputableCharacteristics);

                                this._data = result;
                                this._items = items;
                                this.setState({
                                    changes: true,
                                    updated: this.props.project.dataUpToDate,
                                    externalRules: true,
                                    loading: false,
                                    displayedItems: items,
                                });
                            } else {
                                project.ruleSetWithComputableCharacteristics = result.ruleSetWithComputableCharacteristics;
                                project.externalRules = true;

                                let tabsUpToDate = this.props.project.tabsUpToDate.slice();
                                tabsUpToDate[this.props.value] = null;
                                tabsUpToDate[this.props.value] = !this.props.project.result.classification;
                                tabsUpToDate[this.props.value] = !this.props.project.result.crossValidation;

                                this.props.onTabChange(project, this.props.project.dataUpToDate, tabsUpToDate);
                            }
                        }).catch(error => {
                            console.log(error);
                            if (this._isMounted) this.setState({loading: false});
                        });
                    } else {
                        response.json().then(result => {
                            if (this._isMounted) {
                                msg = "error: " + result.status + " " + result.message;
                                let alertProps = {title: "Something went wrong. Couldn't upload rules :("};
                                this.setState({
                                    loading: false,
                                    snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "warning"}
                                });
                            }
                        }).catch(() => {
                            if (this._isMounted) {
                                msg = "Something went wrong! Couldn't upload rules :(";
                                let alertProps = {title: "ERROR " + response.status};
                                this.setState({
                                    loading: false,
                                    snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "error"}
                                });
                            }
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    if (this._isMounted) {
                        msg = "Server error! Couldn't upload rules :(";
                        this.setState({
                            loading: false,
                            snackbarProps: {open: true, message: msg, variant: "error"}
                        });
                    }
                });
            });
        }
    };

    onSaveFileClick = () => {
        const project = this.props.project;
        let msg = "";

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
                        let alertProps = {title: "Something went wrong! Couldn't download rules :("};
                        this.setState({
                            snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "warning"},
                        });
                    }
                }).catch(() => {
                    msg = "Something went wrong! Couldn't download rules :(";
                    let alertProps = {title: "ERROR " + response.status};
                    this.setState({
                        snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "error"}
                    })
                });
            }
        }).catch(error => {
            console.log(error);
            if (this._isMounted) {
                msg = "Server error! Couldn't download rules :( ";
                this.setState({
                    snackbarProps: {open: true, message: msg, variant: "error"},
                });
            }
        });
    };

    onFilterChange = (event) => {
        const filteredItems = filterFunction(event.target.value.toString(), this._items.slice(0));
        this.setState({displayedItems: filteredItems});
    };

    onDetailsOpen = (index) => {
        this.setState({
            openDetails: true,
            selectedItem: {...this._items[index]}
        });
    };

    onDetailsClose = () => {
        this.setState({
            openDetails: false,
            selectedItem: null
        });
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState({snackbarProps: undefined});
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
                    indicesOfPositiveObjects: data[i].ruleCoverageInformation.indicesOfPositiveObjects.slice(),
                    indicesOfNeutralObjects: data[i].ruleCoverageInformation.indicesOfNeutralObjects.slice(),
                    indicesOfCoveredObjects: data[i].ruleCoverageInformation.indicesOfCoveredObjects.slice(),
                    decisionsOfCoveredObjects: {...data[i].ruleCoverageInformation.decisionsOfCoveredObjects},
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
        const {loading, displayedItems, threshold, typeOfUnions, selectedItem, openDetails,
            openSettings, snackbarProps} = this.state;

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
                    height={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                    id={"rules-settings-drawer"}
                    open={openSettings}
                >
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"rules-union-type-selector"}>
                        <TypeOfUnionsSelector
                            onChange={this.onTypeOfUnionsChange}
                            value={typeOfUnions}
                        />
                    </RuleWorkSmallBox>
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"rules-threshold-selector"}>
                        <ThresholdSelector
                            onChange={this.onThresholdChange}
                            value={threshold}
                        />
                    </RuleWorkSmallBox>
                    <SettingsFooter
                        id={"rules-settings-footer"}
                        onClose={this.onSettingsClose}
                    />
                </RuleWorkDrawer>
                <RuleWorkBox
                    id={"rules-body"}
                    style={!openSettings ? {zIndex: 2} : undefined}
                    styleVariant={"tab-body"}
                >
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
                <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose} />
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