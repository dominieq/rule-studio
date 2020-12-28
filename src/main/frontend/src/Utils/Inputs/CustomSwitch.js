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

/**
 * <h3>Overview</h3>
 * The FormControlLabel from Material-UI library with {@link StyledSwitch} as a control.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/form-control-label/" target="_blank">FormControlLabel</a>
 * and this
 * <a href="https://material-ui.com/components/switches/#switch-with-formcontrollabel" target="_blank">tutorial</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props - Any other props will be forwarded to the FormControlLabel component.
 * @returns {React.ReactElement}
 */
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
