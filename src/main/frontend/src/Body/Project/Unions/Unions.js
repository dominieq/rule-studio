import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import ConsistencySelector from "./inputs/ConsistencySelector";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkButton from "../../../RuleWorkComponents/Inputs/RuleWorkButton";
import RuleWorkSelect from "../../../RuleWorkComponents/Inputs/RuleWorkSelect";
import RuleWorkHelper from "../../../RuleWorkComponents/Feedback/RuleWorkHelper";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import Union from "./api/Union";
import UnionListItem from "./data-display/UnionListItem";
import UnionListItemContent from "./data-display/UnionListItemContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import "./Unions.css";

class Unions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: "",
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
        if (!project.unionsWithSingleLimitingDecision) return;

        fetch(`http://localhost:8080/projects/${project.id}/unions`, {
            method: "GET",
        }).then(response => {
            return response.json();
        }).then(result => {
            this.setState({
                data: result,
            });
        }).catch(error => {
            this.setState({
                snackbarProps: {
                    open: true,
                    message: "Server error. Couldn't load unions!",
                    variant: "error",
                },
            }, () => {
                console.log(error);
            });
        });
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
        const link = `http://localhost:8080/projects/${project.id}/unions?consistencyThreshold=${consistency}`;

        this.setState({
            loading: true,
        }, () => {
            fetch(link, {
                method: "GET"
            }).then(response => {
                return response.json();
            }).then(result => {
                this.setState({
                    loading: false,
                    data: result,
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

    getUnions = (unions) => {
        let downward = [];
        let upward = [];

        if (unions) {
            const downwardUnions = unions.downwardUnions;
            const upwardUnions = unions.upwardUnions;

            for (let i = 0; i < downwardUnions.length; i++) {
                let union = this.unionByIndex(
                    "down-" + i,
                    "At most",
                    downwardUnions[i]
                );
                downward = [...downward, union];
            }

            for (let i = 0; i < upwardUnions.length; i++) {
                let union = this.unionByIndex(
                    "up-" + i,
                    "At least",
                    upwardUnions[i]
                );
                upward = [...upward, union];
            }
        }
        return {downwardUnions: downward, upwardUnions: upward};
    };

    unionByIndex = (index, name, union) => {
        return new Union(index, name, union);
    };

    render() {
        const {loading, data, consistency, measure, } = this.state;
        const {downwardUnions, upwardUnions} = this.getUnions(data);

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
                    <Fragment>
                        {downwardUnions.map(union => (
                            <UnionListItem key={union.id} union={union}>
                                <UnionListItemContent union={union} />
                            </UnionListItem>
                        ))}
                        {upwardUnions.map(union => (
                            <UnionListItem key={union.id} union={union}>
                                <UnionListItemContent union={union} />
                            </UnionListItem>
                        ))}
                    </Fragment>
                }
                </RuleWorkBox>
            </RuleWorkBox>
        )
    }
}

Unions.propTypes = {
    project: PropTypes.object,
};

export default Unions;