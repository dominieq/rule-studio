import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RuleWorkSelect from "../../../../RuleWorkComponents/Inputs/RuleWorkSelect";
import {getDominanceTypes} from "../api/DominanceTypes";

class DominanceSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dominance: "All",
        };
    }

    onDominanceChange = (event) => {
        const dominance = event.target.value;

        this.setState({
            dominance: dominance,
        }, () => {
            this.props.onDominanceChange({
                dominance: dominance,
                where: "bar",
            });
        });
    };

    onDominanceUpdate = (dominance) => {
        this.setState({
            dominance: dominance,
        });
    };

    render() {
        const dominance = this.state.dominance;
        const dominanceTypes = getDominanceTypes();

        return (
            <RuleWorkSelect
                label={"Select dominance"}
                onChange={this.onDominanceChange}
                value={dominance}
            >
                {["All",...dominanceTypes]}
            </RuleWorkSelect>
        );
    }
}

DominanceSelector.propTypes = {
    onDominanceChange: PropTypes.func,
};

export default DominanceSelector;