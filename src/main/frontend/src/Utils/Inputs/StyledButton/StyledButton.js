import React from "react";
import PropTypes from "prop-types";
import { mergeClasses } from "../../utilFunctions";
import { hexToRgb } from "../../utilFunctions/colors";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    textPrimary: {
        color: theme.palette.background.sub,
        '&:hover': {
            backgroundColor: hexToRgb(theme.palette.background.sub, 0.04)
        }
    },
    textSecondary: {
        color: theme.palette.text.special1,
        '&:hover': {
            backgroundColor: hexToRgb(theme.palette.text.special1, 0.04)
        }
    },
    containedPrimary: {
        color: theme.palette.text.main2,
        backgroundColor: theme.palette.background.sub,
        "&:hover": {
            color: theme.palette.text.main2,
            backgroundColor: theme.palette.background.subDark
        },
        "&:active": {
            color: theme.palette.text.main2,
            backgroundColor: theme.palette.background.subDark
        }
    },
    containedSecondary: {
        color: theme.palette.text.main2,
        backgroundColor: theme.palette.text.special1,
        "&:hover": {
            color: theme.palette.text.main2,
            backgroundColor: theme.palette.text.special1Dark
        },
        "&:active": {
            color: theme.palette.text.main2,
            backgroundColor: theme.palette.text.special1Dark
        }
    },
    outlinedPrimary: {
        color: theme.palette.background.sub,
        borderColor: theme.palette.background.sub,
        '&:hover': {
            color: theme.palette.background.sub,
            backgroundColor: hexToRgb(theme.palette.background.sub, 0.04),
            borderColor: theme.palette.background.sub
        }
    },
    outlinedSecondary: {
        color: theme.palette.text.special1,
        borderColor: theme.palette.text.special1,
        '&:hover': {
            color: theme.palette.text.special1,
            backgroundColor: hexToRgb(theme.palette.text.special1, 0.04),
            borderColor: theme.palette.text.special1
        }
    }
}), {name: "CustomButton"});

function StyledButton(props) {
    const { ButtonRef, classes: propsClasses, ...other } = props;

    let classes = useStyles();
    if(propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <Button classes={{...classes}} ref={ButtonRef} {...other}/>
    );
}

StyledButton.propTypes = {
    ButtonRef: PropTypes.object,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(["default", "inherit", "primary", "secondary"]),
    component: PropTypes.elementType,
    disabled: PropTypes.bool,
    disableElevation: PropTypes.bool,
    disableFocusRipple: PropTypes.bool,
    disableRipple: PropTypes.bool,
    endIcon: PropTypes.node,
    fullWidth: PropTypes.bool,
    href: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    startIcon: PropTypes.node,
    variant: PropTypes.oneOf(["text", "outlined", "contained"])
};

StyledButton.defaultProps = {
    color: "inherit"
};

export default StyledButton;
