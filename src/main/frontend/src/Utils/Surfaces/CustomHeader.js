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

/**
 * <h3>Overview</h3>
 * The {@link StyledPaper} component customized as a sticky header.
 *
 * <h3>Usage</h3>
 * Styles applied to this component are different than in Material-UI.
 * "Root" class defines layout of elements inside of the header.
 * "Sticky" class defines the header as a sticky HTML element.
 *
 * @constructor
 * @category Utils
 * @subcategory Surfaces
 * @param {Object} props - Any other props will be forwarded to the {@link StyledPaper} component.
 * @param {Object} [props.classes] - Override or extend the styles applied to the component.
 * @returns {React.ReactElement}
 */
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
