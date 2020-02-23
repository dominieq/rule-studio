import React from 'react';
import PropTypes from 'prop-types';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {getDominanceTypes} from "./api/DominanceTypes";


export function DominanceSelector(props) {
    const dominance = props.dominance;
    const dominanceTypes = getDominanceTypes();

    return (
        <div className={"dominance-selector-wrapper"}>
            <FormControl variant={"outlined"} fullWidth={true}>
                <Select
                    id={"dominance-selector"}
                    value={dominance}
                    onChange={event => props.setDominance(event)}
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

DominanceSelector.propTypes = {
    dominance: PropTypes.string.isRequired,
    setDominance: PropTypes.func.isRequired
};