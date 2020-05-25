import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1,
    }
}), {name: "StyledPaper"});

function StyledPaper(props) {
    const { classes: propsClasses, paperRef, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
            <Paper classes={{root: classes.root}} ref={paperRef} {...other} />
    );
}

StyledPaper.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    component: PropTypes.elementType,
    elevation: PropTypes.number,
    paperRef: PropTypes.object,
    square: PropTypes.bool,
    variant: PropTypes.oneOf(["elevation", "outlined"]),
};

export default StyledPaper;
