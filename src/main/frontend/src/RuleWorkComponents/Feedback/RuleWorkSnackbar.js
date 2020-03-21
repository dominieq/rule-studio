import React from "react";
import PropTypes from "prop-types";
import Snackbar from "@material-ui/core/Snackbar";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Alert from "@material-ui/lab/Alert";

function SnackbarAlert(props) {
    const {children, title, ...other} = props;

    return (
        <Alert elevation={6} variant={"filled"} {...other}>
            {title && <AlertTitle>{title}</AlertTitle>}
            {children}
        </Alert>
    )
}

function RuleWorkSnackbar(props) {
    const {alertProps, message, onClose, open, snackbarProps, variant} = props;

    return (
        <Snackbar onClose={onClose} open={open} {...snackbarProps}>
            <SnackbarAlert onClose={onClose} severity={variant} {...alertProps}>
                {message}
            </SnackbarAlert>
        </Snackbar>
    )
}

RuleWorkSnackbar.propTypes = {
    alertProps: PropTypes.shape({
        icon: PropTypes.node,
        title: PropTypes.node,
    }),
    message: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    snackbarProps: PropTypes.shape({
        anchorOrigin: PropTypes.exact({
            horizontal: PropTypes.oneOf(["left", "center", "right"]),
            vertical: PropTypes.oneOf(["top", "bottom"]),
        }),
        autoHideDuration: PropTypes.number,
        resumeHideDuration: PropTypes.number,
        TransitionComponent: PropTypes.elementType
    }),
    variant: PropTypes.oneOf(["info", "success", "warning", "error"])
};

RuleWorkSnackbar.defaultProps = {
    snackbarProps: {
        autoHideDuration: 6000,
    },
};

export default RuleWorkSnackbar