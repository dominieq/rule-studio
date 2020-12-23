import React from "react";
import PropTypes from "prop-types";
import { mergeClasses } from "../utilFunctions";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.special1,
        marginBottom: "0.5rem"
    }
}), {name: "CustomFormLabel"});

/**
 * <h3>Overview</h3>
 * The FormLabel component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/form-label/" target="_blank">FormLabel</a>.
 *
 * @class
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props - All props except classes are forwarded to the FormLabel component.
 * @param {Object} ref - Holds reference to the FormLabel component.
 * @returns {React.ReactElement}
 */
function CustomFormLabel(props, ref) {
    const { classes: propsClasses, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <FormLabel classes={{...classes}} ref={ref} component={"header"} {...other} />
    )
}

const CustomFormLabelForwardRef = React.forwardRef(CustomFormLabel);

CustomFormLabelForwardRef.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["primary", "secondary"]),
    component: PropTypes.elementType,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    filled: PropTypes.bool,
    focused: PropTypes.bool,
    required: PropTypes.bool
};

export default CustomFormLabelForwardRef;
