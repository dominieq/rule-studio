import React from "react";
import PropTypes from "prop-types";
import { mergeClasses } from "../utilFunctions";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.background.sub,
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.background.subDark
        }
    }
}), {name: "CustomRadioButton"});

/**
 * The Radio component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/radio/" target="_blank">Radio</a>.
 *
 * @name Styled Radio Button
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param props {Object} - Any other props will be forwarded to the Radio component.
 * @returns {React.ReactElement} - The Radio component from Material-UI library.
 */
function StyledRadioButton(props) {
    const { classes: propsClasses, ...other } = props;
    let classes = useStyles();

    if (propsClasses) classes =  mergeClasses(classes, propsClasses);

    return (
        <Radio classes={{...classes}} {...other} />
    );
}

StyledRadioButton.propTypes = {
    checked: PropTypes.bool,
    checkedIcon: PropTypes.node,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["default", "primary", "secondary"]),
    disabled: PropTypes.bool,
    disableRipple: PropTypes.bool,
    icon: PropTypes.node,
    id: PropTypes.string,
    inputProps: PropTypes.object,
    inputRef: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    size: PropTypes.oneOf(["medium", "big"]),
    value: PropTypes.any
};

StyledRadioButton.defaultProps = {
    color: "default",
    disableRipple: true
};

export default StyledRadioButton;
