import React from "react";
import { mergeClasses } from "../../utilFunctions";
import { hexToRgb } from "../../utilFunctions/colors";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { StyledIconButtonPropTypes } from "./propTypes";

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

/**
 * <h3>Overview</h3>
 * The IconButton component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/icon-button/" target="_blank">IconButton</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props  - Any other props will be forwarded to the IconButton component.
 * @param {Object} [props.ButtonRef]  - The reference forwarded to the IconButton component.
 * @param {boolean} [props.disablePadding = false] - If <code>true</code> the padding of the IconButton will be set to 0.
 * @returns {React.ReactElement}
 */
function StyledIconButton(props) {
    const { ButtonRef, classes: propsClasses, disablePadding, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    let style;
    if (disablePadding) {
        style = { padding: 0 };
    }

    return (
        <IconButton classes={{...classes}} ref={ButtonRef} style={style} {...other} />
    );
}

StyledIconButton.propTypes = { ...StyledIconButtonPropTypes };

StyledIconButton.defaultProps = {
    color: "inherit",
    disablePadding: false
};

export default StyledIconButton;
