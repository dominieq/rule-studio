import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStylesAlert = makeStyles({

});

function Alert(props) {
    const {children, ...other} = props;
    const classes = useStylesAlert();

    return (
        <MuiAlert {...other} elevation={6} variant={"filled"}>
            {children}
        </MuiAlert>
    )
}

const useStylesSnackbar = makeStyles({

});

function StyledSnackbar(props) {
    const {open, variant, message, onClose} = props;
    const classes = useStylesSnackbar();

    return (
        <Snackbar autoHideDuration={6000} open={open} onClose={onClose}>
            <Alert onClose={onClose} severity={variant}>{message}</Alert>
        </Snackbar>
    )
}

StyledSnackbar.propTypes = {
    open: PropTypes.bool,
    variant: PropTypes.oneOf(["info", "success", "warning", "error"]),
    message: PropTypes.string,
    onClose: PropTypes.func,
};

StyledSnackbar.defaultProps = {
    open: false,
    variant: "info",
    message: "This is custom RuleWork snackbar",
};

export default StyledSnackbar