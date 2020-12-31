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

/**
 * <h3>Overview</h3>
 * The Alert component wrapped around in Snackbar component from Material-UI library.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/alert/" target="_blank">Alert</a>
 * and
 * <a href="https://material-ui.com/api/snackbar/" target="_blank">Snackbar</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props - Any other props will be forwarded to the Alert component.
 * @param {string} [props.message] - The content of the component.
 * @param {Object} [props.snackbarProps] - Props applied to the Snackbar component.
 * @returns {React.ReactElement}
 */
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
