import React from 'react';
import PropTypes from "prop-types";
import FullscreenDialog from "./Utils/FullscreenDialog";
import MultiColumnContent from "./Utils/MultiColumnContent";
import TitlePanel from "./Utils/TitlePanel";

function RuleWorkDialog(props) {
    const {children, onClose, open, title, ...other} = props;

    return (
        <FullscreenDialog onClose={onClose} open={open} {...other}>
            <TitlePanel onClose={onClose} title={title}/>
            <MultiColumnContent>
                {children}
            </MultiColumnContent>
        </FullscreenDialog>
    );
}

RuleWorkDialog.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string,
};

export default RuleWorkDialog;