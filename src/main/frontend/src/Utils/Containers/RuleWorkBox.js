import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";

const useStyles = makeStyles({
    body: {
        margin: "2.5%",
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    tab: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
        overflow: "hidden",
    },
    "tab-body": {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        marginTop: "2.5%",
        padding: "0 2.5% 2.5%",
        overflow: "auto",
    },
}, {name: "rule-work"});

function RuleWorkBox(props) {
    const {children, classes: propsClasses, className, styleVariant, ...other} =  props;
    let classes = useStyles();

    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <div className={clsx(classes[styleVariant], className)} {...other}>
            {children}
        </div>
    )
}

RuleWorkBox.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    styleVariant: PropTypes.oneOf(["body", "tab", "tab-body"]),
};

RuleWorkBox.defaultProps = {
    styleVariant: "body",
};

export default RuleWorkBox;