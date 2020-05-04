import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import StyledSwitch from "./StyledSwitch";

const labelStyles = makeStyles({
    root: {
        position: "relative",
        margin: 0,
        display: "flex",
    },
});

function CustomSwitch(props) {
    const {classes: propsClasses, label, ...other} = props;
    let classes = labelStyles();

    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <FormControlLabel
            classes={classes}
            control={<StyledSwitch {...other} />}
            label={label}
        />
    )
}

CustomSwitch.propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};

export default CustomSwitch;