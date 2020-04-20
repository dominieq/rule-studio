import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles"
import { mergeClasses } from "../utilFunctions";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
    bar: {
        margin: "0 16px",
        backgroundColor: theme.palette.background.default
    },
    panel: {
        margin: "12px 0",
        height: 1,
        backgroundColor: theme.palette.paper.text
    }
}), {name: "styled-divider"});

function StyledDivider(props) {
    const {classes: propsClasses, className, styleVariant, ...other} = props;
    let classes = useStyles();

    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <Divider className={clsx(classes[styleVariant], className)} {...other} />
    )
}

StyledDivider.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    flexItem: PropTypes.bool,
    orientation: PropTypes.oneOf(["horizontal", "vertical"]),
    styleVariant: PropTypes.oneOf(["bar", "panel"]),
    variant: PropTypes.oneOf(["fullWidth", "inset", "middle"]),
};

StyledDivider.defaultProps = {
    flexItem: true,
    orientation: "vertical",
    styleVariant: "bar",
    variant: "fullWidth"
};

export default StyledDivider;