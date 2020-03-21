import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.chip.text,
        backgroundColor: theme.palette.chip.background,
    },
    clickable: {
        '&:hover': {
            color: theme.palette.chip.text,
            backgroundColor: theme.palette.chip.background,
        }
    },
    deletable: {
        '&:focus': {
            color: theme.palette.chip.text,
            backgroundColor: theme.palette.chip.background,
        }
    }
}), {name: "MuiFileChip"});


function StyledFileChip(props) {
    const {classes: propsClasses, ...other} = props;
    const classes = {...useStyles(), ...propsClasses};

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