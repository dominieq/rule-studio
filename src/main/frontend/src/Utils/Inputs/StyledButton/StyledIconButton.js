import React from "react";
import PropTypes from "prop-types";
import { mergeClasses } from "../../utilFunctions";
import { hexToRgb } from "../../utilFunctions/colors";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
    root: {
        padding: 6
    },
    colorPrimary: {
        color: theme.palette.background.sub,
        '&:hover': {
            backgroundColor: hexToRgb(theme.palette.background.sub, 0.04)
        }
    },
    colorSecondary: {
        color: theme.palette.text.special1,
        '&:hover': {
            backgroundColor: hexToRgb(theme.palette.text.special1, 0.04)
        }
    }
}), {name: "CustomIconButton"})

function StyledIconButton(props) {
    const { ButtonRef, classes: propsClasses, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <IconButton classes={{...classes}} ref={ButtonRef} {...other} />
    );
}

StyledIconButton.propTypes = {
    ButtonRef: PropTypes.object,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(["default", "inherit", "primary", "secondary"]),
    component: PropTypes.elementType,
    disabled: PropTypes.bool,
    disableFocusRipple: PropTypes.bool,
    disableRipple: PropTypes.bool,
    edge: PropTypes.oneOf(["start", "end", false]),
    href: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.oneOf(["small", "medium"])
};

StyledIconButton.defaultProps = {
    color: "inherit"
};

export default StyledIconButton;
