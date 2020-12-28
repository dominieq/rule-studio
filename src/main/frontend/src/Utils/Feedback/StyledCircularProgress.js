import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.default,
    },
    wrapper: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
}), {name: "MuiCircularProgress"});

/**
 * <h3>Overview</h3>
 * The Circular Progress component from Material-UI with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/circular-progress/" target="_blank">Circular Progress</a>.
 *
 * <h3>Usage</h3>
 * When <code>useWrapper</code> is <code>true</code> a <code>wrapper</code> class is added to container
 * that centers circular progress inside of it.
 *
 * @constructor
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props - Any other props will be forwarded to the Circular Progress component.
 * @param {boolean} [props.useWrapper=true] - If <code>true</code> add <code>wrapper</code> class to container.
 * @returns {React.ReactElement}
 */
function StyledCircularProgress(props) {
    const { classes: propsClasses, className, useWrapper, ...other } = props;
    let classes = useStyles();

    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    const {wrapper, ...otherClasses} = classes;

    return (
        <div className={clsx({[wrapper]: useWrapper}, className)}>
            <CircularProgress {...other} classes={otherClasses} />
        </div>
    )
}

StyledCircularProgress.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(["inherit", "primary", "secondary"]),
    disableShrink: PropTypes.bool,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    thickness: PropTypes.number,
    useWrapper: PropTypes.bool,
    value: PropTypes.number,
    variant: PropTypes.oneOf(["determinant", "indeterminant", "static"])
};

StyledCircularProgress.defaultProps = {
    disableShrink: true,
    useWrapper: true,
};

export default StyledCircularProgress;
