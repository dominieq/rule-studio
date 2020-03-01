import React from "react";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        backgroundColor: "#2A3439",
    },
    flexItem: {
        height: "1px",
    },
});

function StyledDivider(props) {
    const {...other} = props;
    const classes = useStyles();

    return (
        <Divider {...other} classes={{root: classes.root, flexItem: classes.flexItem}} />
    )
}

export default StyledDivider;