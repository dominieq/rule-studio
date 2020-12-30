import React from "react";
import { MuiFormControlLabelPropTypes } from "./propTypes";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";

/**
 * <h3>Overview</h3>
 * The FormControlLabel from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs
 * <a href="https://material-ui.com/api/form-control-label/" target="_blank">FormControlLabel</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props - All props will be forwarded to the FormControlLabel component.
 */
const CustomControlLabel = withStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "space-between",
        marginLeft: 0,
        marginRight: 0,
        '&:hover': {
            color: theme.palette.background.subDark
        }
    }
}), {name: "CustomControlLabel"})(props => (
    <FormControlLabel labelPlacement={"start"} {...props} />
));

CustomControlLabel.propTypes = { ...MuiFormControlLabelPropTypes }

export default CustomControlLabel;
