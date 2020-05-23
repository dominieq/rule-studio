import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../../../Utils/utilFunctions";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.paper.background,
        color: theme.palette.paper.text,
        '&::-webkit-scrollbar': {
            width: 17
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.button.contained.background,
            '&:hover': {
                backgroundColor: theme.palette.button.contained.backgroundAction
            }
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)"
        }
    }
}), {name: "Text"});

function StyledScrollable(props) {
    const { classes: propsClasses, className, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <div
            aria-label={"scrollable-container"}
            className={clsx(classes.root, className)}
            id={"scrollable"}
            {...other}
        />
    );
}

StyledScrollable.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    onScroll: PropTypes.func
};

export default StyledScrollable;
