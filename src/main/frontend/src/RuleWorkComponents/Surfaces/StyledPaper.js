import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.paper.background,
        color: theme.palette.paper.text,
    },
    bar: {
        position: "relative",
        padding: "2px 16px",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        zIndex: 2,
    },
    panel: {
        position: "relative",
        width: "fit-content",
        height: "fit-content",
        padding: "8px 16px",
    },
    popper: {
        backgroundColor: theme.palette.popper.background,
        border: "1px solid",
        borderColor: theme.palette.background.default,
        borderRadius: "2.5%",
        color: theme.palette.popper.text,
        marginTop: 1,
    }
}), {name: "rule-work"});

function StyledPaper(props) {
    const {children, classes: propsClasses, className, styleVariant, paperRef, ...other} = props;
    const classes = {...useStyles(), ...propsClasses};

    return (
            <Paper
                className={clsx(classes.paper, classes[styleVariant], className)}
                {...paperRef ? {ref: paperRef} : null}
                {...other}
            >
                {children}
            </Paper>
    )
}

StyledPaper.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    component: PropTypes.elementType,
    elevation: PropTypes.number,
    paperRef: PropTypes.object,
    square: PropTypes.bool,
    styleVariant: PropTypes.oneOf(["bar", "panel", "popper"]),
    variant: PropTypes.oneOf(["elevation", "outlined"]),
};

StyledPaper.defaultProps = {
    square: true,
    elevation: 0,
    styleVariant: "bar",
};

export default StyledPaper;