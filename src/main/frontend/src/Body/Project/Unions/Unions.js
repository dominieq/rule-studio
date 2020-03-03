import React, {Component} from "react";
import PropTypes from "prop-types";
import ConsistencySelector from "./inputs/ConsistencySelector";
import RuleWorkSelect from "../../../RuleWorkComponents/Inputs/RuleWorkSelect";
import StyledButton from "./inputs/StyledButton";
import StyledHelper from "../../../RuleWorkComponents/Feedback/StyledHelper";
import StyledRuleWorkBar from "../../../RuleWorkComponents/Surfaces/StyledRuleWorkBar";
import Union from "./api/Union";
import UnionListItem from "./data-display/UnionListItem";
import UnionListItemContent from "./data-display/UnionListItemContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import unions from "./resources/demo/example-unions";
import "./Unions.css";

class Unions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            consistency: 1.0,
            measure: "epsilon",
            downwardUnions: [],
            upwardUnions: [],
        };
    }

    setConsistency = (consistency) => {
        this.setState({
            consistency: consistency,
        });
    };

    onSelectChange = (event) => {
        this.setState({
            measure: event.target.value,
        });
    };

    getUnions = (unions) => {
        const downwardUnions = unions.downwardUnions;
        const upwardUnions = unions.upwardUnions;

        let downward = [];
        let upward = [];

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

        this.setState({
            downwardUnions: downward,
            upwardUnions: upward,
        });
    };

    unionByIndex = (index, name, union) => {
        return new Union(index, name, union);
    };

    onCountUnionsClick = () => {
        this.getUnions(unions);

        if (this.props.project) return;

        const project = this.props.project;
        const consistency = this.state.consistency;

        fetch(`http://localhost:8080/projects/${project.id}/unions?consistencyThreshold=${consistency}`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(result => {
            this.getUnions(result);
        }).catch(error => {
            console.log(error);
        });
    };

    render() {
        const {measure, downwardUnions, upwardUnions} = this.state;

        return (
            <div className={"unions"}>
                <StyledRuleWorkBar id={"unions-bar"}>
                    <ConsistencySelector
                        setGlobalConsistency={(c) => this.setConsistency(c)}
                    />
                    <Divider flexItem={true} orientation={"vertical"} />
                    <StyledHelper >
                        {"Consistency helper"}
                    </StyledHelper>
                    <RuleWorkSelect
                        disabledChildren={["rough membership"]}
                        onChange={this.onSelectChange}
                        value={measure}
                    >
                        {["epsilon", "rough membership"]}
                    </RuleWorkSelect>
                    <span>
                        <Typography variant={"subtitle2"}>
                            Current consistency: {this.state.consistency}
                        </Typography>
                    </span>
                    <Divider flexItem={true} orientation={"vertical"} />
                    <StyledButton
                        disabled={!this.props.project}
                        disableElevation
                        onClick={this.onCountUnionsClick}
                        variant={"contained"}
                    >
                        Calculate
                    </StyledButton>
                </StyledRuleWorkBar>
                <div className={"unions-list"}>
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
                </div>
            </div>
        )
    }
}

Unions.propTypes = {
    project: PropTypes.object,
};

export default Unions