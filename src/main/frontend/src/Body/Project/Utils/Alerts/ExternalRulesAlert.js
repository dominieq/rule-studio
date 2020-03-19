import React from "react";
import {makeStyles} from "@material-ui/core";
import {TransferUp} from "mdi-material-ui";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.button.secondary,
    }
}), {name: "MuiSvgRoot"});

function ExternalRulesAlert() {
    const classes = useStyles();
    return (
        <TransferUp classes={{...classes}} />
    )
}

export default ExternalRulesAlert;