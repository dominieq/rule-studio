import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

const useStyles = makeStyles(theme => ({
    docked: {
        position: "absolute",
        maxWidth: "50%",
        minWidth: "25%",
        left: 0,
        zIndex: 1,
    },
    paper: {
        position: "relative",
        padding: "0 16px 8px",
        backgroundColor: theme.palette.paper.background,
        color: theme.palette.paper.text,
        boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), " +
            "0px 24px 38px 3px rgba(0,0,0,0.14), " +
            "0px 9px 46px 8px rgba(0,0,0,0.1)",
        zIndex: 0,
    },
}), {name: "rule-work-drawer"});

function RuleWorkDrawer(props) {
    const {children, height, onClickAway, ...other} = props;
    const classes = useStyles();

    return (
        <Drawer classes={{docked: classes.docked, paper: classes.paper}} variant={"persistent"} {...other}>
            <div style={{height: height}}/>
            {children}
        </Drawer>
    )
}

RuleWorkDrawer.propTypes = {
    children: PropTypes.node,
    height: PropTypes.number,
};

export default RuleWorkDrawer;