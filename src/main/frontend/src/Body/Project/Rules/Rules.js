import React, {Component} from 'react';
import PropTypes from "prop-types";
import Item from "../../../RuleWorkComponents/API/Item";
import MeasureSelector from "../ProjectTabsUtils/MeasureSelector";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer";
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTooltip from "../../../RuleWorkComponents/Inputs/RuleWorkTooltip";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import RuleWorkUpload from "../../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import ThresholdSelector from "../ProjectTabsUtils/ThresholdSelector";
import SvgIcon from "@material-ui/core/SvgIcon";
import Calculator from "mdi-material-ui/Calculator";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import {mdiCloseThick, mdiCog} from "@mdi/js";

class Rules extends Component {
    constructor(props) {
        super(props);

        this._data = {};
        this._items = [];

        this.state = {
            changes: false,
            loading: false,
            displayedItems: [],
            externalRules: false,
            threshold: 0,
            measure: "epsilon",
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
            fetch(`http://localhost:8080/projects/${project.result.id}/rules`, {
                method: "GET",
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        console.log(result);

                        const items = this.getItems(result);

                        if (this._isMounted) {
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
                        if (this._isMounted) {
                            this.setState({
                                loading: false,
                                externalRules: this.props.project.external,
                                threshold: this.props.threshold,
                                measure: this.props.measure,
                                snackbarProps: {
                                    open: true,
                                    message: "Rules loaded but couldn't parse!",
                                    variant: "error",
                                },
                            }, () => {
                                console.log(error);
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
                if (this._isMounted) {
                    this.setState({
                        loading: false,
                        externalRules: this.props.project.external,
                        threshold: this.props.threshold,
                        measure: this.props.measure,
                        snackbarProps: {
                            open: true,
                            message: "Server error. Couldn't load rules!",
                            variant: "error",
                        },
                    }, () => {
                        console.log(error);
                    });
                }
            });
        });

    }

    componentWillUnmount() {
        if (this.state.changes) {
            let project = {...this.props.project};
            if (Object.keys(this._data).length) {
                project.result.ruleSetWithCharacteristics = this._data;
            }
            project.externalRules = this.state.externalRules;
            project.threshold = this.state.threshold;
            project.measure = this.state.measure;
            this.props.onTabChange(project, this.props.value, false)
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
        this.setState({
            loading: true,
        }, () => {
            const project = {...this.props.project};

            fetch(`http://localhost:8080/projects/${project.result.id}/rules`, {
                method: "PUT",
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        console.log(result);
                        const items = this.getItems(result);

                        if (this._isMounted) {
                            this.setState({
                                changes: true,
                                loading: false,
                                displayedItems: items,
                            }, () => {
                                this._data = result;
                                this._items = items;
                            });
                        }
                    }).catch(error => {
                        if (this._isMounted) {
                            this.setState({
                                loading: false,
                                snackbarProps: {
                                    open: true,
                                    message: "Error. Rules calculated but couldn't parse!",
                                    variant: "error",
                                },
                            }, () => {
                                console.log(error);
                            });
                        }
                    })
                } else  if (response.status === 404) {
                    if (this._isMounted) {
                        this.setState({
                            loading: false,
                            snackbarProp: {
                                open: true,
                                message: "Couldn't calculate rules. Perhaps you didn't calculate unions :)",
                                variant: "info",
                            },
                        }, () => {
                            console.log(response);
                        });
                    }
                } else {
                    if (this._isMounted) {
                        this.setState({
                            loading: false,
                            snackbarProp: {
                                open: true,
                                message: "Something went wrong. Couldn't calculate rules :(",
                                variant: "warning",
                            },
                        }, () => {
                            console.log(response);
                        });
                    }
                }
            }).catch(error => {
                if (this._isMounted) {
                    this.setState({
                        loading: false,
                        snackbarProps: {
                            open: true,
                            message: "Server error. Couldn't calculate rules!",
                            variant: "error",
                        },
                    }, () => {
                        console.log(error);
                    });
                }
            });
        });
    };

    onUploadFileChanged = (event) => {
        console.log(event.target.files[0]);
        if (event.target.file[0]) {
            const project = {...this.props.project};
            let data = new FormData();
            data.append("rules", event.target.files[0]);
            this.setState({
                loading: true,
            }, () => {
                fetch(`http://localhost:8080/projects/${project.result.id}`, {
                    method: "POST",
                    body: data,
                }).then(response => {
                    return response.json();
                }).then(result => {
                    console.log(result);
                    const items = this.getItems(result);

                    if (this._isMounted) {
                        this.setState({
                            changes: true,
                            loading: false,
                            displayedItems: items,
                            externalRules: true,
                        }, () => {
                            this._data = result;
                            this._items = items;
                        });
                    }
                }).catch(error => {
                    if (this._isMounted) {
                        this.setState({
                            loading: false,
                            snackbarProps: {
                                open: true,
                                message: "Server error. Couldn't parse rules!",
                                variant: "error",
                            },
                        }, () => {
                            console.log(error);
                        });
                    }
                });
            });
        }
    };

    onSaveFileClick = () => {
        const project = {...this.props.project};

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
                    if (this._isMounted) {
                        this.setState({
                            snackbarProp: {
                                open: true,
                                message: "Error. Couldn't parse file!",
                                variant: "error",
                            },
                        }, () => {
                            console.log(error);
                        });
                    }
                });
            } else {
                if (this._isMounted) {
                    this.setState({
                        snackbarProps: {
                            open: true,
                            message: "Something went wrong. Couldn't download rules :(",
                            variant: "warning",
                        },
                    }, () => {
                        console.log(response);
                    });
                }
            }
        }).catch(error => {
            if (this._isMounted) {
                this.setState({
                    snackbarProps: {
                        open: true,
                        message: "Server error. Couldn't download rules!",
                        variant: "error",
                    },
                }, () => {
                    console.log(error);
                });
            }
        });
    };

    onFilterChange = (event) => {
        const filterText = event.target.value;
    };

    onSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            snackbarProps: undefined,
        });
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
        const {loading, displayedItems, threshold, measure, openSettings, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-rules"} styleVariant={"tab"}>
                <StyledPaper
                    id={"rules-bar"}
                    paperRef={this.upperBar}
                    styleVariant={"bar"}
                    square={true}
                    variant={"outlined"}
                >
                    <RuleWorkTooltip title={"Click to choose consistency & measure"}>
                        <StyledButton
                            aria-label={"rules-settings-button"}
                            isIcon={true}
                            onClick={this.onSettingsClick}
                            themeVariant={"primary"}
                            variant={"contained"}
                        >
                            <SvgIcon><path d={mdiCog} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={`Calculate with threshold ${threshold}`}>
                        <StyledButton
                            aria-label={"rules-calculate-button"}
                            disabled={!this.props.project || loading}
                            disableElevation={true}
                            onClick={this.onCalculateClick}
                            startIcon={<Calculator />}
                            themeVariant={"primary"}
                            variant={"contained"}
                        >
                            Calculate
                        </StyledButton>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={"Upload file"}>
                        <RuleWorkUpload
                            accept={".json"}
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
                            disabled={!this.props.project || !this.state.displayedItems.length || loading}
                            isIcon={true}
                            onClick={this.onSaveFileClick}
                        >
                            <SaveIcon />
                        </StyledButton>
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
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
                    <RuleWorkSmallBox id={"rules-settings-footer"} styleVariant={"footer"}>
                        <StyledButton
                            aria-label={"rules-close-settings-button"}
                            isIcon={true}
                            onClick={this.onSettingsClose}
                            themeVariant={"secondary"}
                        >
                            <SvgIcon><path d={mdiCloseThick} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkSmallBox>
                </RuleWorkDrawer>
                <RuleWorkBox
                    id={"rules-body"}
                    style={!openSettings ? {zIndex: 2} : undefined}
                    styleVariant={"tab-body"}
                >
                    {loading ?
                        <StyledCircularProgress />
                        :
                        <RuleWorkList>
                            {displayedItems}
                        </RuleWorkList>
                    }
                </RuleWorkBox>
                <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose} />
            </RuleWorkBox>
        )
    }
}

Rules.propTypes = {
    dataUpToDate: PropTypes.bool,
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    upToDate: PropTypes.bool,
    value: PropTypes.number,
};

export default Rules;