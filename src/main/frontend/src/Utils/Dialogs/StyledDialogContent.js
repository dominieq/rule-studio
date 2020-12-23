import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";

/**
 * <h3>Overview</h3>
 * The DialogContent from the Material-UI library with custom styling.
 * For full documentation check out Material-UI docs
 * <a href=https://material-ui.com/api/dialog-content/ target="_blank">DialogContent</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Dialogs
 * @param {Object} props - All props will be forwarded to the DialogContent component.
 * @returns {React.ReactElement}
 */
const StyledDialogContent = withStyles(theme=> ({
    dividers: {
        borderTopColor: theme.palette.text.main1,
        borderBottomColor: theme.palette.text.main1,
    }
}),{name: "StyledDialogContent"})(props => <DialogContent dividers={true} {...props} />);

StyledDialogContent.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    dividers: PropTypes.bool
};

export default StyledDialogContent;
