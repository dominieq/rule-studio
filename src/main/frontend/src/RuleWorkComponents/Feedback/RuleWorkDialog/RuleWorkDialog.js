import React from 'react';
import PropTypes from "prop-types";
import FullscreenDialog from "../../DataDisplay/FullscreenDialog";
import MultiColDialogContent from "../../DataDisplay/MultiColDialogContent";
import FullscreenDialogTitleBar from "../../DataDisplay/FullscreenDialogTitleBar";

function RuleWorkDialog(props) {
    const {children, onClose, open, title, ...other} = props;

    return (
        <FullscreenDialog onClose={onClose} open={open} {...other}>
            <FullscreenDialogTitleBar onClose={onClose} title={title}/>
            <MultiColDialogContent>
                {children}
            </MultiColDialogContent>
        </FullscreenDialog>
    );
}

RuleWorkDialog.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    title: PropTypes.node,
};

export default RuleWorkDialog;