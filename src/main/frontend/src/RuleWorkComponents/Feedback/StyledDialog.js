import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles( theme => ({
    paper: {
        backgroundColor: theme.palette.paper.background,
        color: theme.palette.paper.text,
    }
}));

function StyledDialog(props) {
    const {children, classes: propsClasses, ...other} = props;
    const classes = {...useStyles(), ...propsClasses};

    return (
        <Dialog classes={classes} {...other}>
            {children}
        </Dialog>
    )
}

StyledDialog.propTypes = {
    'aria-describedby': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    disableBackdropClick: PropTypes.bool,
    disableEscapeKeyDown: PropTypes.bool,
    fullScreen: PropTypes.bool,
    fullWidth: PropTypes.bool,
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
    onBackdropClick: PropTypes.func,
    onClose: PropTypes.func,
    onEnter: PropTypes.func,
    onEntered: PropTypes.func,
    onEntering: PropTypes.func,
    onEscapeKeyDown: PropTypes.func,
    onExit: PropTypes.func,
    onExited: PropTypes.func,
    onExiting: PropTypes.func,
    open: PropTypes.bool.isRequired,
};

export default StyledDialog;