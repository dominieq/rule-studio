import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {getDominanceTypes} from "../api/DominanceTypes";
import "./DominanceSelector.css";

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
        let dominance = this.state.dominance;
        const dominanceTypes = getDominanceTypes();

        return (
            <div className={"dominance-selector-wrapper"}>
                <FormControl variant={"outlined"} fullWidth={true}>
                    <Select
                        id={"dominance-selector"}
                        value={dominance}
                        onChange={this.onDominanceChange}
                    >
                        <MenuItem value={"All"}>
                            <em>All</em>
                        </MenuItem>
                        {dominanceTypes.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        );
    }
}

DominanceSelector.propTypes = {
    onDominanceChange: PropTypes.func.isRequired,
};

export default DominanceSelector;