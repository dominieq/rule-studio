import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
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

function StyledCircularProgress(props) {
    const {classes: propsClasses, className, useWrapper, ...other} = props;
    const classes = {...useStyles(), ...propsClasses};
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