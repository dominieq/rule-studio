import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { MuiFormControlLabelPropTypes, StyledSwitchPropTypes } from "./propTypes";
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
 * @param {Object} props - Any other props will be forwarded to the {@link StyledSwitch} element.
 * @param {string} props.label - The text to be used in an enclosing label element.
 * @param {Object} props.labelClasses - Override or extend the styles applied to the {@link FormControlLabel} element.
 * @param {Object} props.LabelProps - Props applied to the {@link FormControlLabel} element.
 * @returns {React.ReactElement}
 */
function CustomSwitch(props) {
    const { label, labelClasses, labelProps, ...other } = props;

    let classes = labelStyles();
    if (labelClasses) classes = mergeClasses(classes, labelClasses);

    return (
        <FormControlLabel
            classes={classes}
            control={<StyledSwitch {...other} />}
            label={label}
            {...labelProps}
        />
    )
}

CustomSwitch.propTypes = {
    label: PropTypes.string,
    labelClasses: PropTypes.object,
    LabelProps: PropTypes.shape({ ...MuiFormControlLabelPropTypes }),
    ...StyledSwitchPropTypes
};

export default CustomSwitch;
