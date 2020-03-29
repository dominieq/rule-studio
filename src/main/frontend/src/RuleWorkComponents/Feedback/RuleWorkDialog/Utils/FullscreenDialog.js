import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import StyledDialog from "../../StyledDialog";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction={"up"} ref={ref} {...props} />
});

const paperStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
    }
}), {name: "fullscreen-dialog"});

function FullscreenDialog(props) {
    const { children, onClose, open, ...other } = props;
    const paperClasses = paperStyles();

    return (
        <StyledDialog
            fullScreen={true}
            PaperProps={{
                classes: {root: paperClasses.root}
            }}
            onClose={onClose}
            open={open}
            TransitionComponent={Transition}
            {...other}
        >
            {children}
        </StyledDialog>
    )
}

FullscreenDialog.propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
};

export default FullscreenDialog