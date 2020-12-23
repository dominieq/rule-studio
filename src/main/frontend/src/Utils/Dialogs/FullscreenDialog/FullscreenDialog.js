import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import {mergeClasses} from "../../utilFunctions";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction={"up"} ref={ref} {...props} />
});

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
    }
}), {name: "FullscreenDialog"});

/**
 * <h3>Overview</h3>
 * The Dialog component from Material-UI with Slide transition and different background color.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/dialog/">Dialog</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Dialogs
 * @param props {Object} All props will be forwarded to the Dialog component.
 * @returns {React.ReactElement}
 */
function FullscreenDialog(props) {
    const { PaperProps, ...other } = props;

    let classes = useStyles();
    if (PaperProps != null && PaperProps.classes != null) {
        classes = mergeClasses(classes, PaperProps.classes);
    }

    return (
        <Dialog
            fullScreen={true}
            PaperProps={{ ...PaperProps, classes }}
            TransitionComponent={Transition}
            {...other}
        />
    );
}

FullscreenDialog.propTypes = {
    'aria-describedby': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    children: PropTypes.node,
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
    PaperComponent: PropTypes.elementType,
    PaperProps: PropTypes.object,
    scroll: PropTypes.oneOf(['body', 'paper']),
    TransitionComponent: PropTypes.elementType,
    transitionDuration: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
            appear: PropTypes.number,
            enter: PropTypes.number,
            exit: PropTypes.number
        })
    ]),
    TransitionProps: PropTypes.object,
};

export default FullscreenDialog;
