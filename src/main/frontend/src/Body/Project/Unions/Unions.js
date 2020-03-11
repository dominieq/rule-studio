import React, {Component} from "react";
import PropTypes from "prop-types";
import ConsistencySelector from "./inputs/ConsistencySelector";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer";
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkHelper from "../../../RuleWorkComponents/Feedback/RuleWorkHelper";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSelect from "../../../RuleWorkComponents/Inputs/RuleWorkSelect";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import RuleWorkTooltip from "../../../RuleWorkComponents/Inputs/RuleWorkTooltip";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import Calculator from "mdi-material-ui/Calculator";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCog} from "@mdi/js";
import "./Unions.css";

class Unions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            displayedData: [],
            consistency: 0.0,
            measure: "epsilon",
            openSettings: false,
            snackbarProps: {
                open: false,
                message: "",
                variant: "info"
            },
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        const project = this.props.project;

        if (project.result.calculatedUnionsWithSingleLimitingDecision) {
            this.setState({
                loading: true,
            }, () => {
                fetch(`http://localhost:8080/projects/${project.result.id}/unions`, {
                    method: "GET",
                }).then(response => {
                    return response.json();
                }).then(result => {
                    console.log(result);

                    const unions = this.getUnions(result);

                    this.setState({
                        loading: false,
                        data: unions,
                        displayedData: unions,
                    });
                }).catch(error => {
                    this.setState({
                        loading: false,
                        snackbarProps: {
                            open: true,
                            message: "Server error. Couldn't load unions!",
                            variant: "error",
                        },
                    }, () => {
                        console.log(error);
                    });
                });
            });
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

    onConsistencyChange = (consistency) => {
        this.setState({
            consistency: consistency,
        });
    };

    onSelectChange = (event) => {
        this.setState({
            measure: event.target.value,
        });
    };

    onCountUnionsClick = () => {
        if (!this.props.project) return;

        const project = this.props.project;
        const consistency = this.state.consistency;
        const link = `http://localhost:8080/projects/${project.result.id}/unions?consistencyThreshold=${consistency}`;

        this.setState({
            loading: true,
        }, () => {
            fetch(link, {
                method: "GET"
            }).then(response => {
                return response.json();
            }).then(result => {
                console.log(result);

                const unions = this.getUnions(result);

                this.setState({
                    loading: false,
                    data: unions,
                    displayedUnions: unions,
                });
            }).catch(error => {
                console.log(error);
                this.setState({
                    loading: false,
                    snackbarProps: {
                        open: true,
                        message: "Server error. Couldn't calculate unions!",
                        variant: "error",
                    },
                });
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

    getUnions = (data) => {
        let items = [];

        if (data) {
            for (let type of ["downwardUnions", "upwardUnions"]) {
                console.log(type);
                console.log(data[type]);
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
        const {loading, displayedData, consistency, measure, openSettings, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-unions"} styleVariant={"tab"}>
                <StyledPaper id={"unions-bar"} paperRef={this.upperBar} square={true} variant={"outlined"}>
                    <RuleWorkTooltip title={"Click to choose consistency & measure"}>
                        <StyledButton isIcon={true} onClick={this.onSettingsClick}>
                            <SvgIcon><path d={mdiCog}/></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={`Calculate with consistency ${consistency}`}>
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
                    <RuleWorkSmallBox id={"consistency-selector"}>
                        <ConsistencySelector
                            onConsistencyChange={this.onConsistencyChange}
                        />
                    </RuleWorkSmallBox>
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"measure-selector"}>
                        <RuleWorkHelper>
                            {"Consistency helper"}
                        </RuleWorkHelper>
                        <RuleWorkSelect
                            disabledChildren={["rough membership"]}
                            label={"Select measure"}
                            onChange={this.onSelectChange}
                            value={measure}
                        >
                            {["epsilon", "rough membership"]}
                        </RuleWorkSelect>
                    </RuleWorkSmallBox>
                    <RuleWorkSmallBox styleVariant={"footer"}>
                        <StyledButton
                            isIcon={true}
                            onClick={this.onSettingsClose}
                            themeVariant={"secondary"}
                        >
                            <ChevronLeftIcon />
                        </StyledButton>
                    </RuleWorkSmallBox>
                </RuleWorkDrawer>
                <RuleWorkBox id={"unions-list"} styleVariant={"tab-body"}>
                {loading ?
                    <StyledCircularProgress/>
                    :
                    <RuleWorkList>
                        {displayedData}
                    </RuleWorkList>
                }
                </RuleWorkBox>
                <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose} />
            </RuleWorkBox>
        )
    }
}

Unions.propTypes = {
    changed: PropTypes.array,
    project: PropTypes.object.isRequired,
    updateProject: PropTypes.func,
    value: PropTypes.number,
};

export default Unions;