import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import StyledSwitch from "./StyledSwitch";

const labelStyles = makeStyles({
    root: {
        position: "relative",
        margin: 0,
        display: "flex",
    },
});

function RuleWorkSwitch(props) {
    const {classes: propsClasses, label, ...other} = props;
    const classes = {...labelStyles(), ...propsClasses};

    return (
        <FormControlLabel
            classes={classes}
            control={<StyledSwitch {...other} />}
            label={label}
        />
    )
}

RuleWorkSwitch.propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};

export default RuleWorkSwitch;