import React from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {getDominanceTypes} from "./api/DominanceTypes";

export function ObjectListItemHeader(props) {
    const {dominance, name} = props;
    const dominanceTypes = getDominanceTypes();

    return (
        <div className={"object-list-item-header"}>
            <Typography variant={"button"} component={"span"}>
                Object {name}
            </Typography>
            <FormControl
                aria-label={"selector-for-object-" + name}
                label={"selector-for-object-" + name}
                onClick={event => event.stopPropagation()}
                onFocus={event => event.stopPropagation()}
                variant={"outlined"}
                margin={"dense"}
                component={"div"}
            >
                <Select
                    id={"single-dominance-selector"}
                    value={dominance}
                    onChange={event => props.onDominanceChange(event)}
                >
                    <MenuItem value={"All"}><em>All</em></MenuItem>
                    {dominanceTypes.map(type => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

ObjectListItemHeader.propTypes = {
    dominance: PropTypes.string.isRequired,
    name: PropTypes.any.isRequired,
    onDominanceChange: PropTypes.func.isRequired,
};