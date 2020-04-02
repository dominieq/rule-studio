import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";

const SimpleDialog = withStyles( theme => ({
    paper: {
        backgroundColor: theme.palette.paper.background,
        color: theme.palette.paper.text,
    }
}), {name: "simple-dialog"})(props => (
    <Dialog {...props}/>
));

export default SimpleDialog;