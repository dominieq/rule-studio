import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";

const SimpleDialog = withStyles( theme => ({
    paper: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1,
    }
}), {name: "simple-dialog"})(props => (
    <Dialog {...props}/>
));

export default SimpleDialog;
