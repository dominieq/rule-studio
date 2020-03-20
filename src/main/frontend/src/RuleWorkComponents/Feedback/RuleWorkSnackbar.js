import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Alert from "@material-ui/lab/Alert";

const useStylesAlert = makeStyles({

});

function SnackbarAlert(props) {
    const {children, hasTitle, title, ...other} = props;
    const classes = useStylesAlert();

    return (
        <Alert elevation={6} variant={"filled"} {...other}>
            {hasTitle ? <AlertTitle>{title}</AlertTitle> : null}
            {children}
        </Alert>
    )
}

const useStylesSnackbar = makeStyles({

});

function RuleWorkSnackbar(props) {
    const {alertProps, message, onClose, open, snackbarProps, variant} = props;
    const classes = useStylesSnackbar();

    return (
        <Snackbar
            onClose={onClose}
            open={open}
            {...snackbarProps}
        >
            <SnackbarAlert
                onClose={onClose}
                severity={variant}
                {...alertProps}
            >
                {message}
            </SnackbarAlert>
        </Snackbar>
    )
}

RuleWorkSnackbar.propTypes = {
    alertProps: PropTypes.shape({
        hasTitle: PropTypes.bool,
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
    alertProps: {
        hasTitle: false,
    },
    open: false,
    message: "Forgot to set snackbar message?",
    snackbarProps: {
        autoHideDuration: 6000,
        resumeHideDuration: 0,
    },
    variant: "info",
};

export default RuleWorkSnackbar