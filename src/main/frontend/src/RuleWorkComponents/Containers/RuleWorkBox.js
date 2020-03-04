import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    body: {
        margin: "2.5%",
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    tab: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    "tab-body": {
        margin: "2.5%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
    }
}, {name: "rule-work"});

function RuleWorkBox(props) {
    const {children, styleVariant, ...other} =  props;
    const classes = useStyles();

    return (
        <div {...other} className={clsx(classes[styleVariant])}>
            {children}
        </div>
    )
}

RuleWorkBox.propTypes = {
    children: PropTypes.node,
    styleVariant: PropTypes.oneOf(["body", "tab", "tab-body"]).isRequired,
};

export default RuleWorkBox;