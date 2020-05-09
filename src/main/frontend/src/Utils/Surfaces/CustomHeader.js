import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import StyledPaper from "./StyledPaper";

const useStyles = makeStyles(theme => ({
    Root: {
        alignItems: "center",
        display: "flex",
        padding: "4px 16px"
    },
    Sticky: {
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar
    }
}), {name: "CustomHeader"});

function CustomHeader(props) {
    const { classes: propsClasses, className: propsClassName, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <StyledPaper
            aria-label={"custom header"}
            className={clsx(classes.Root, classes.Sticky, propsClassName)}
            component={"header"}
            elevation={6}
            square={true}
            tab-index={-1}
            {...other}
        />
    );
}

CustomHeader.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.shape({
        Root: PropTypes.any,
        Sticky: PropTypes.any
    }),
    className: PropTypes.string,
    component: PropTypes.elementType,
    elevation: PropTypes.number,
    paperRef: PropTypes.object,
    square: PropTypes.bool,
    variant: PropTypes.oneOf(["elevation", "outlined"])
};

export default CustomHeader;
