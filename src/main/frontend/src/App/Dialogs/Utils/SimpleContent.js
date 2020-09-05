import React from "react";
import { withStyles } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";

/**
 * The DialogContent from the Material-UI library with custom styling.
 * For full documentation check out Material-UI docs
 * <a href=https://material-ui.com/api/dialog-content/ target="_blank">DialogContent</a>.
 *
 * @class
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props - Any other props will be forwarded to the DialogContent component.
 * @returns {React.ReactElement}
 */
const SimpleContent = withStyles(theme=> ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    dividers: {
        borderTopColor: theme.palette.text.main1,
        borderBottomColor: theme.palette.text.main1,
    }
}),{name: "simple-content"})(props => (
    <DialogContent dividers={true} {...props} />
));

export default SimpleContent;
