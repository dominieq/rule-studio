import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";

/**
 * The Dialog from the Material-UI library with custom styling.
 * For full documentation check out Material-UI docs
 * <a href=https://material-ui.com/api/dialog/ target="_blank">Dialog</a>.
 *
 * @class
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props - Any other props will be forwarded to the Dialog component.
 * @returns {React.ReactElement}
 */
const SimpleDialog = withStyles( theme => ({
    paper: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1,
    }
}), {name: "simple-dialog"})(props => (
    <Dialog {...props}/>
));

export default SimpleDialog;
