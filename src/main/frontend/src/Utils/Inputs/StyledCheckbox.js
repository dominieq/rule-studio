import React from "react";
import PropTypes from "prop-types";
import { mergeClasses } from "../utilFunctions";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.background.sub,
        '&:hover': {
            backgroundColor: "transparent",
            color: theme.palette.background.subDark
        }
    }
}), {name: "CustomCheckbox"});

/**
 * <h3>Overview</h3>
 * The CheckBox component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/checkbox/" target="_blank">CheckBox</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props - Any other props will be forwarded to the CheckBox component.
 * @returns {React.ReactElement}
 */
function StyledCheckbox(props) {
    const { classes: propsClasses, inputProps, ...other } = props;
    let classes = useStyles();

    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <Checkbox
            classes={{...classes}}
            inputProps={{
                "aria-label": "styled checkbox",
                ...inputProps
            }}
            {...other}
        />
    )
}

StyledCheckbox.propTypes = {
    checked: PropTypes.bool,
    checkedIcon: PropTypes.node,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["default", "primary", "secondary"]),
    disabled: PropTypes.bool,
    disableRipple: PropTypes.bool,
    icon: PropTypes.node,
    id: PropTypes.string,
    indeterminate: PropTypes.bool,
    indeterminateIcon: PropTypes.node,
    inputProps: PropTypes.object,
    inputRef: PropTypes.object,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    size: PropTypes.oneOf(["medium", "big"]),
    value: PropTypes.any
};

StyledCheckbox.defaultProps = {
    color: "default",
    disableRipple: true
}

export default StyledCheckbox;
