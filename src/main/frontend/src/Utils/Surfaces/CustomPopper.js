import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
    popper: {
        backgroundColor: theme.palette.background.sub,
        color: theme.palette.text.main2
    }
}), {name: "CustomPopper"});

function CustomPopper(props) {
    const { classes: propsClasses, className: propsClassName, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <Paper
            aria-label={"custom popper"}
            className={clsx(classes.popper, propsClassName)}
            elevation={6}
            role={"menu"}
            tabIndex={-1}
            {...other}
        />
    );
}

CustomPopper.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.shape({
        Popper: PropTypes.any
    }),
    className: PropTypes.string,
    component: PropTypes.elementType,
    elevation: PropTypes.number,
    square: PropTypes.bool,
    variant: PropTypes.oneOf(["elevation", "outlined"])
};

export default CustomPopper;
