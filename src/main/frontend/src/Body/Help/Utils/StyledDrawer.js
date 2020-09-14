import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

/**
 * The Drawer component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/drawer/" target="_blank">Drawer</a>.
 *
 * @name Styled Drawer
 * @constructor
 * @category Help
 * @subcategory Utilities
 * @param {Object} props - Any other props will be forwarded to the Drawer component.
 * @returns{React.ReactElement}
 */
const StyledDrawer = withStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.background.main1,
        borderLeft: "none",
        color: theme.palette.background.sub,
        minWidth: "15%"
    }
}), {name: "Help"})(props => <Drawer {...props} />);

export default StyledDrawer;
