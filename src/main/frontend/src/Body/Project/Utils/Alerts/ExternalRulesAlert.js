import React from "react";
import {makeStyles} from "@material-ui/core";
import {TransferUp} from "mdi-material-ui";

const useStyles = makeStyles({
    root: {
        color: "#E8D963",
    }
}, {name: "MuiSvgRoot"});

function ExternalRulesAlert() {
    const classes = useStyles();
    return (
        <TransferUp classes={{...classes}} />
    )
}

export default ExternalRulesAlert;