import React from "react";
import PropTypes from "prop-types";
import {useOutlinedInputStyles} from "./MakeOutlinedInputStyles";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

function RuleWorkSelect(props) {
    const {children, disabledChildren, ...other} = props;
    const classes = useOutlinedInputStyles();

    return (
        <FormControl classes={{root: classes.root}} margin={"dense"} variant={"outlined"}>
            <Select {...other} labelWidth={0}>
                {children.map((option, index) => (
                    <MenuItem
                        disabled={!disabledChildren ? false : disabledChildren.includes(option)}
                        key={index}
                        value={option}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

RuleWorkSelect.propTypes = {
    children: PropTypes.array.isRequired,
    disabledChildren: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.any,
};

export default RuleWorkSelect;