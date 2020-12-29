import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { StyledPaperPropTypes } from "./propTypes";
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

/**
 * <h3>Overview</h3>
 * The {@link StyledPaper} component customized as a section adjusting it's size to content.
 *
 * <h3>Usage</h3>
 * Styles applied to this component are different than in Material-UI.
 * "Root" class defines the size and padding of the section.
 *
 * @constructor
 * @category Utils
 * @subcategory Surfaces
 * @param {Object} props - Any other props will be forwarded to the {@link StyledPaper} component.
 * @param {Object} [props.classes] - Override or extend the styles applied to the component.
 * @returns {React.ReactElement}
 */
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
    ...StyledPaperPropTypes,
    classes: PropTypes.shape({
        Root: PropTypes.any,
    })
};

export default CustomSection;
