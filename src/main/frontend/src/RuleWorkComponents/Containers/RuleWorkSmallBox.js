import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    row: {
        margin: "4px 0",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "space-between"
    },
    'multi-row': {
        margin: "4px 0",
        display: "flex",
        flexDirection: "column",
    },
    footer: {
        marginTop: 8,
        display: "flex",
        flexDirection: "row-reverse"
    }
},{name: "rule-work-box"});

function RuleWorkSmallBox(props) {
    const {children, classes: propsClasses, className, styleVariant, ...other} = props;
    const classes = {...useStyles(), ...propsClasses};

    return (
        <div className={clsx(classes[styleVariant], className)} {...other}>
            {children}
        </div>
    )
}

RuleWorkSmallBox.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    styleVariant: PropTypes.oneOf(["row", "multi-row", "footer"])
};

RuleWorkSmallBox.defaultProps = {
    styleVariant: "row",
};

export default RuleWorkSmallBox;