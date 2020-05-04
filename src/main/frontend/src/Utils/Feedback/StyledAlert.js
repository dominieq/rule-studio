import React from "react";
import PropTypes from "prop-types";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

function MuiAlert(props) {
    const {children, title, ...other} = props;

    return (
        <Alert elevation={6} variant={"filled"} {...other}>
            {title && <AlertTitle>{title}</AlertTitle>}
            {children}
        </Alert>
    )
}

function StyledAlert(props) {
    const {message, onClose, open, snackbarProps, ...other} = props;

    return (
        <Snackbar onClose={onClose} open={open} {...snackbarProps}>
            <MuiAlert onClose={onClose} {...other}>
                {message}
            </MuiAlert>
        </Snackbar>
    )
}

StyledAlert.propTypes = {
    message: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    snackbarProps: PropTypes.shape({
        anchorOrigin: PropTypes.exact({
            horizontal: PropTypes.oneOf(["left", "center", "right"]),
            vertical: PropTypes.oneOf(["top", "bottom"]),
        }),
        autoHideDuration: PropTypes.number,
    }),
    title: PropTypes.node,
    severity: PropTypes.oneOf(["info", "success", "warning", "error"])
};

StyledAlert.defaultProps = {
    snackbarProps: {
        autoHideDuration: 6000,
    },
};

export default StyledAlert