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
 * <h3>Overview</h3>
 * The Chip component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/chip/" target="_blank">Chip</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Data Display
 * @param {Object} props - Any other props will be forwarded to the Chip component.
 * @param {string} [props.className] - The class name of the component.
 * @returns {React.ReactElement}
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
