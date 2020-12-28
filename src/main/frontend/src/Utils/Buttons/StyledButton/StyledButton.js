import React from "react";
import { mergeClasses } from "../../utilFunctions";
import { hexToRgb } from "../../utilFunctions/colors";
import { StyledButtonPropTypes } from "./propTypes";
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

/**
 * <h3>Overview</h3>
 * The Button component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/button/" target="_blank">Button</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props - Any other props will be forwarded to the Button component.
 * @param {Object} [props.ButtonRef] - The reference forwarded to the Button component.
 * @returns {React.ReactElement}
 */
function StyledButton(props) {
    const { ButtonRef, classes: propsClasses, ...other } = props;

    let classes = useStyles();
    if(propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <Button classes={{...classes}} ref={ButtonRef} {...other}/>
    );
}

StyledButton.propTypes = { ...StyledButtonPropTypes };

StyledButton.defaultProps = {
    color: "inherit"
};

export default StyledButton;
