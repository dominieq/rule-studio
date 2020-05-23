import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

const StyledDrawer = withStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.background.main1,
        borderLeft: "none",
        color: theme.palette.background.sub,
        minWidth: "15%"
    }
}), {name: "Help"})(props => <Drawer {...props} />);

export default StyledDrawer;
