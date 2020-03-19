import React, {Component} from 'react';
import PropTypes from "prop-types";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterNoResults from "../Utils/Filtering/FilterNoResults";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Calculations/CalculateButton";
import MeasureSelector from "../Utils/Calculations/MeasureSelector";
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
            measure: "epsilon",
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

                            this.setState({
                                loading: false,
                                displayedItems: items,
                                externalRules: this.props.project.external,
                                threshold: this.props.project.threshold,
                                measure: this.props.project.measure,
                            }, () => {
                                this._data = result;
                                this._items = items;
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) {
                            this.setState({
                                loading: false,
                                externalRules: this.props.project.external,
                                threshold: this.props.threshold,
                                measure: this.props.measure,
                            });
                        }
                    });
                } else {
                    if (this._isMounted) {
                        this.setState({
                            loading: false,
                            externalRules: this.props.project.external,
                            threshold: this.props.project.threshold,
                            measure: this.props.project.measure,
                        });
                    }
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't load rules :( " + error.message;
                    this.setState({
                        loading: false,
                        externalRules: this.props.project.external,
                        threshold: this.props.threshold,
                        measure: this.props.measure,
                        snackbarProps: {open: true, message: msg, variant: "error"},
                    });
                }
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
            project.measure = this.state.measure;
            this.props.onTabChange(project, this.props.value, this.state.updated)
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
            threshold: threshold,
        });
    };

    onMeasureChange = (event) => {
        this.setState({
            changes: event.target.value !== "epsilon",
            measure: event.target.value,
        });
    };

    onCalculateClick = () => {
        let project = {...this.props.project};

        this.setState({
            loading: true,
        }, () => {
            let data = new FormData();
            data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
            data.append("data", JSON.stringify(project.result.informationTable.objects));

            let msg = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/rules`, {
                method: project.dataUpToDate ? "PUT" : "POST",
                body: project.dataUpToDate ? null : data
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = this.getItems(result);

                            this.setState({
                                changes: true,
                                updated: true,
                                loading: false,
                                displayedItems: items,
                            }, () => {
                                this._data = result;
                                this._items = items;
                            });
                        } else {
                            project.ruleSetWithComputableCharacteristics = result;
                            this.props.onTabChange(project, this.props.value, true);
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    })
                } else  if (response.status === 404) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "error " + result.status + ": " + result.message;
                            let alertProps = {hasTitle: true, title: "Something went wrong! Please don't panic :)"};
                            this.setState({
                                loading: false,
                                snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "info"},
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate rules :( " + error.message;
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
                            const items = this.getItems(result.ruleSetWithComputableCharacteristics);
                            if (this._isMounted) {
                                this.setState({
                                    changes: true,
                                    updated: this.props.project.dataUpToDate,
                                    loading: false,
                                    displayedItems: items,
                                    externalRules: true,
                                }, () => {
                                    this._data = result;
                                    this._items = items;
                                });
                            } else {
                                project.ruleSetWithComputableCharacteristics = result;
                                project.externalRules = true;
                                this.props.onTabChange(project, this.props.value, this.props.project.dataUpToDate);
                            }
                        }).catch(error => {
                            console.log(error);
                            if (this._isMounted) this.setState({loading: false});
                        });
                    } else {
                        response.json().then(result => {
                            if (this._isMounted) {
                                let alert = {hasTitle: true, title: "Something went wrong. Please don't panic :) "};
                                msg = "error: " + result.status + " " + result.message;
                                this.setState({
                                    loading: false,
                                    snackbarProps: {alertProps: alert, open: true, message: msg, variant: "warning"}
                                });
                            }
                        }).catch(error => {
                            console.log(error);
                            if (this._isMounted) this.setState({loading: false});
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    if (this._isMounted) {
                        msg = "Server error! Couldn't parse rules :( ";
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
                    let alert = {hasTitle: true, title: "Something went wrong! Couldn't download rules :("};
                    msg = "error: " + result.status + " " + result.message;
                    if (this._isMounted) {
                        this.setState({
                            snackbarProps: {alertProps: alert, open: true, message: msg, variant: "warning"},
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        }).catch(error => {
            console.log(error);
            if (this._isMounted) {
                msg = "Server error! Couldn't download rules :( " + error.message;
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
            selectedItem: this.state.displayedItems[index],
            openDetails: true
        });
    };

    onDetailsClose = () => {
        this.setState({
            selectedItem: null,
            openDetails: false
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
                const id = i.toString();
                const name = data[i].rule.toString;
                const traits = data[i].ruleCharacteristics;
                const tables = {
                    indicesOfPositiveObjects: data[i].ruleCoverageInformation.indicesOfPositiveObjects,
                    indicesOfNeutralObjects: data[i].ruleCoverageInformation.indicesOfNeutralObjects,
                    indicesOfCoveredObjects: data[i].ruleCoverageInformation.indicesOfCoveredObjects,
                    decisionsOfCoveredObjects: data[i].ruleCoverageInformation.decisionsOfCoveredObjects,
                };

                const item = new Item(id, name, traits, null, tables);
                items = [...items, item];
            }
        }
        return items;
    };

    render() {
        const {loading, displayedItems, threshold, measure, selectedItem, openDetails,
            openSettings, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-rules"} styleVariant={"tab"}>
                <StyledPaper id={"rules-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"rules-settings-button"}
                        onClick={this.onSettingsClick}
                        title={"Click to choose consistency & measure"}
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
                    <RuleWorkSmallBox id={"rules-measure-selector"}>
                        <MeasureSelector
                            onChange={this.onMeasureChange}
                            value={measure}
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
                                {displayedItems}
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