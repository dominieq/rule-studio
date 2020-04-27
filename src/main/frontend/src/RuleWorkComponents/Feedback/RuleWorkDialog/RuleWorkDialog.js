import React from 'react';
import PropTypes from "prop-types";
import FullscreenDialog from "../../DataDisplay/FullscreenDialog";
import MultiColDialogContent from "../../DataDisplay/MultiColDialogContent";
import FullscreenDialogTitleBar from "../../DataDisplay/FullscreenDialogTitleBar";

function RuleWorkDialog(props) {
    const {children, onClose, open, optional, title, ...other} = props;

    return (
        <FullscreenDialog onClose={onClose} open={open} {...other}>
            <FullscreenDialogTitleBar onClose={onClose} optional={optional} title={title}/>
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
    optional: PropTypes.node,
    title: PropTypes.node,
};

export default RuleWorkDialog;