import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.main2,
        backgroundColor: theme.palette.background.subDark,
    },
    clickable: {
        '&:hover': {
            color: theme.palette.text.main2,
            backgroundColor: theme.palette.background.subDark,
        }
    },
    deletable: {
        '&:focus': {
            color: theme.palette.text.main2,
            backgroundColor: theme.palette.background.subDark,
        }
    }
}), {name: "MuiFileChip"});

/**
 * The Chip component from Material-UI library with overridden classes.
 * For full documentation <a href="https://material-ui.com/api/chip/">check out Material-UI docs</a>.
 *
 * @constructor
 * @param props {Object} - Any other props will be forwarded to the Chip component.
 * @param [props.className] {string} - The class name of the component.
 * @returns {React.Component} The Chip component from Material-UI library.
 */
function StyledFileChip(props) {
    const {classes: propsClasses, ...other} = props;
    const classes = useStyles();

    if (propsClasses) mergeClasses(classes, propsClasses);

    return (
        <Chip classes={classes} {...other} />
    );
}

StyledFileChip.propTypes =  {
    avatar: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    clickable: PropTypes.bool,
    color: PropTypes.oneOf(["default", "primary", "secondary"]),
    component: PropTypes.elementType,
    deleteIcon: PropTypes.element,
    disabled: PropTypes.bool,
    icon: PropTypes.element,
    label: PropTypes.node,
    onDelete: PropTypes.func,
    size: PropTypes.oneOf(["small", "medium"]),
    variant: PropTypes.oneOf(["default", "outlined"])
};

export default StyledFileChip;