import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";

/**
 * The FormControlLabel from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs
 * <a href="https://material-ui.com/api/form-control-label/" target="_blank">FormControlLabel</a>.
 *
 * @name Custom Control Label
 * @constructor
 * @category Utils
 * @subcategory Sort Menu
 * @param props {Object} - Any other props will be forwarded to the FormControlLabel component.
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

export default CustomControlLabel;
