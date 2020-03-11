import React from "react";
import PropTypes from "prop-types";
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
        alignItems: "center"
    },
}, {name: "rule-work"});

function RuleWorkBox(props) {
    const {children, styleVariant, ...other} =  props;
    const classes = useStyles();

    return (
        <div className={classes[styleVariant]} {...other}>
            {children}
        </div>
    )
}

RuleWorkBox.propTypes = {
    children: PropTypes.node,
    styleVariant: PropTypes.oneOf(["body", "tab", "tab-body"]),
};

RuleWorkBox.defaultProps = {
    styleVariant: "body",
};

export default RuleWorkBox;