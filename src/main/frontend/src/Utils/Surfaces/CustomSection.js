import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import StyledPaper from "./StyledPaper";

const useStyles = makeStyles({
    Root: {
        position: "relative",
        width: "fit-content",
        height: "fit-content",
        padding: "8px 16px"
    }
}, {name: "CustomSection"})

function CustomSection(props) {
    const { classes: propsClasses, className: propsClassName, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <StyledPaper
            aria-label={"custom section"}
            className={clsx(classes.Root, propsClassName)}
            component={"section"}
            elevation={6}
            square={true}
            tab-index={-1}
            {...other}
        />
    );
}

CustomSection.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.shape({
        Root: PropTypes.any,
    }),
    className: PropTypes.string,
    component: PropTypes.elementType,
    elevation: PropTypes.number,
    paperRef: PropTypes.object,
    square: PropTypes.bool,
    variant: PropTypes.oneOf(["elevation", "outlined"])
};

export default CustomSection;
