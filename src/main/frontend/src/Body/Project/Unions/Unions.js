import React, {Component} from "react";
import PropTypes from "prop-types";
import ThresholdSelector from "../ProjectTabsUtils/ThresholdSelector";
import MeasureSelector from "../ProjectTabsUtils/MeasureSelector";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer";
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import RuleWorkTooltip from "../../../RuleWorkComponents/Inputs/RuleWorkTooltip";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import Calculator from "mdi-material-ui/Calculator";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCloseThick, mdiCog} from "@mdi/js";

class Unions extends Component {
    constructor(props) {
        super(props);

        this._data = [];
        this._items = [];

        this.state = {
            changes: false,
            loading: false,
            displayedItems: [],
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
            fetch(`http://localhost:8080/projects/${project.result.id}/unions`, {
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
                                threshold: this.props.project.threshold,
                                measure: this.props.project.measure,
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
                    this.setState({
                        loading: false,
                        threshold: this.props.project.threshold,
                        measure: this.props.project.measure,
                    });
                }
            }).catch(error => {
                if (this._isMounted) {
                    this.setState({
                        loading: false,
                        threshold: this.props.project.threshold,
                        measure: this.props.project.measure,
                        snackbarProps: {
                            open: true,
                            message: "Server error. Couldn't load unions!",
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
                project.result.unionsWithSingleLimitingDecision = this._data;
                project.result.calculatedUnionsWithSingleLimitingDecision = true;
            }
            project.threshold = this.state.threshold;
            project.measure = this.state.measure;
            this.props.onTabChange(project, this.props.value, false);
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

    onCountUnionsClick = () => {
        const project = this.props.project;
        const threshold = this.state.threshold;
        const link = `http://localhost:8080/projects/${project.result.id}/unions?consistencyThreshold=${threshold}`;

        this.setState({
            loading: true,
        }, () => {
            fetch(link, {
                method: "GET"
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
                                    message: "Error. Unions calculated but couldn't parse!",
                                    variant: "error",
                                },
                            }, () => {
                                console.log(error);
                            });
                        }
                    });
                } else if (response.status === 404) {
                    if (this._isMounted) {
                        this.setState({
                            loading: false,
                            snackbarProps: {
                                open: true,
                                message: "Couldn't calculate unions. Perhaps you didn't calculate cones :)",
                                variant: "info",
                            }
                        }, () => {
                            console.log(response);
                        });
                    }
                } else {
                    if (this._isMounted) {
                        this.setState({
                            loading: false,
                            snackbarProps: {
                                open: true,
                                message: "Something went wrong. Couldn't calculate unions :(",
                                variant: "warning",
                            }
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
                            message: "Server error. Couldn't calculate unions!",
                            variant: "error",
                        },
                    }, () => {
                        console.log(error);
                    });
                }
            });
        });
    };

    onSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            snackbarProps: {
                open: false,
                message: "",
                variant: "info",
            }
        })
    };

    getItems = (data) => {
        let items = [];

        if (data) {
            for (let type of ["downwardUnions", "upwardUnions"]) {
                for (let i = 0; i < data[type].length; i++) {
                    const id = i.toString();
                    const name = data[type][i].unionType.replace("_", " ").toLowerCase();
                    const traits = {
                        accuracyOfApproximation: data[type][i].accuracyOfApproximation,
                        qualityOfApproximation: data[type][i].qualityOfApproximation,
                    };
                    const tables = {
                        objects: data[type][i].objects,
                        lowerApproximation: data[type][i].lowerApproximation,
                        upperApproximation: data[type][i].upperApproximation,
                        boundary: data[type][i].boundary,
                        positiveRegion: data[type][i].positiveRegion,
                        negativeRegion: data[type][i].negativeRegion,
                        boundaryRegion: data[type][i].boundaryRegion,
                    };

                    const item = new Item(id, name, traits, null, tables);

                    items = [...items, item];
                }
            }
        }
        return items;
    };

    render() {
        const {loading, displayedItems, threshold, measure, openSettings, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-unions"} styleVariant={"tab"}>
                <StyledPaper id={"unions-bar"} paperRef={this.upperBar} square={true} variant={"outlined"}>
                    <RuleWorkTooltip title={"Click to choose consistency & measure"}>
                        <StyledButton isIcon={true} onClick={this.onSettingsClick}>
                            <SvgIcon><path d={mdiCog}/></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={`Calculate with threshold ${threshold}`}>
                        <StyledButton
                            disabled={!this.props.project || loading}
                            disableElevation
                            onClick={this.onCountUnionsClick}
                            startIcon={<Calculator />}
                            themeVariant={"primary"}
                            variant={"contained"}
                        >
                            Calculate
                        </StyledButton>
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    <StyledDivider />
                </StyledPaper>
                <RuleWorkDrawer
                    height={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                    id={"unions-settings-drawer"}
                    open={openSettings}
                >
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"unions-measure-selector"}>
                        <MeasureSelector
                            onChange={this.onMeasureChange}
                            value={measure}
                        />
                    </RuleWorkSmallBox>
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"unions-threshold-selector"}>
                        <ThresholdSelector
                            onChange={this.onThresholdChange}
                            value={threshold}
                        />
                    </RuleWorkSmallBox>
                    <RuleWorkSmallBox styleVariant={"footer"}>
                        <StyledButton
                            isIcon={true}
                            onClick={this.onSettingsClose}
                            themeVariant={"secondary"}
                        >
                            <SvgIcon><path d={mdiCloseThick} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkSmallBox>
                </RuleWorkDrawer>
                <RuleWorkBox id={"unions-list"} styleVariant={"tab-body"}>
                {loading ?
                    <StyledCircularProgress/>
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

Unions.propTypes = {
    dataUpToDate: PropTypes.bool,
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    upToDate: PropTypes.bool,
    value: PropTypes.number,
};

export default Unions;