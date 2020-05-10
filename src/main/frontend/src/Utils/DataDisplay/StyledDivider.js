import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles"
import { mergeClasses } from "../utilFunctions";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
    primary: {
        backgroundColor: theme.palette.background.default
    },
    secondary: {
        backgroundColor: theme.palette.paper.text
    }
}), {name: "CustomDivider"});

function StyledDivider(props) {
    const { color, classes: propsClasses, className, margin, style: propsStyle, ...other } = props;
    let classes = useStyles();

    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    let style = propsStyle;
    if (props.orientation === "horizontal") {
        style = { ...style, ...{ marginBottom: margin, marginTop: margin } };
    } else if (props.orientation === "vertical") {
        style = { ...style, ...{ marginLeft: margin, marginRight: margin } };
    }

    return (
        <Divider className={clsx(classes[color], className)} style={style} {...other} />
    )
}

StyledDivider.propTypes = {
    absolute: PropTypes.bool,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(["primary", "secondary"]),
    component: PropTypes.elementType,
    flexItem: PropTypes.bool,
    light: PropTypes.bool,
    margin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    orientation: PropTypes.oneOf(["horizontal", "vertical"]),
    variant: PropTypes.oneOf(["fullWidth", "inset", "middle"]),
};

StyledDivider.defaultProps = {
    color: "primary",
    flexItem: true,
    margin: 0,
    orientation: "vertical",
};

export default StyledDivider;
