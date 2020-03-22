import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
    label: {
        minWidth: "fit-content",
        marginRight: "16px"
    },
}, {name: "rule-work"});

function StyledTypography(props) {
    const {children, classes: propsClasses, className, styleVariant, ...other} = props;
    const classes = {...useStyles(), ...propsClasses};

    return (
        <Typography className={clsx(classes[styleVariant], className)} {...other}>
            {children}
        </Typography>
    )
}

StyledTypography.propTypes = {
    align: PropTypes.oneOf(["inherit", "left", "center", "right", "justify"]),
    children: PropTypes.node,
    className: PropTypes.string,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["initial", "inherit", "primary", "secondary",
        "textPrimary", "textSecondary", "error"]),
    component: PropTypes.elementType,
    display: PropTypes.oneOf(["initial", "block", "inline"]),
    gutterBottom: PropTypes.bool,
    noWrap: PropTypes.bool,
    paragraph: PropTypes.bool,
    styleVariant: PropTypes.oneOf(["label"]),
    variant: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "subtitle1", "subtitle2",
        "body1", "body2", "caption", "button", "overline", "srOnly", "inherit"]),
    variantMapping: PropTypes.object,
};

StyledTypography.defaultProps = {
    component: "p"
};

export default StyledTypography;