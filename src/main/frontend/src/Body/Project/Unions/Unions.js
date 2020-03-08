import React, {Component} from "react";
import PropTypes from "prop-types";
import ConsistencySelector from "./inputs/ConsistencySelector";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkHelper from "../../../RuleWorkComponents/Feedback/RuleWorkHelper";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSelect from "../../../RuleWorkComponents/Inputs/RuleWorkSelect";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
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
            snackbarProps: {
                open: false,
                message: "",
                variant: "info"
            },
        };
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
        const {loading, displayedData, consistency, measure, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-unions"} styleVariant={"tab"}>
                <StyledPaper id={"unions-bar"} styleVariant={"bar"} square={true} variant={"outlined"}>
                    <ConsistencySelector
                        onConsistencyChange={(c) => this.onConsistencyChange(c)}
                    />
                    <Divider flexItem={true} orientation={"vertical"} />
                    <RuleWorkHelper >
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
                    <span>
                        <Typography variant={"subtitle2"}>
                            Current consistency: {consistency}
                        </Typography>
                    </span>
                    <Divider flexItem={true} orientation={"vertical"} />
                    <StyledButton
                        buttonVariant={"contained"}
                        disabled={!this.props.project || loading}
                        disableElevation
                        onClick={this.onCountUnionsClick}
                        styleVariant={"green"}
                    >
                        Calculate
                    </StyledButton>
                </StyledPaper>
                <RuleWorkBox id={"unions-list"} styleVariant={"tab-body1"}>
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