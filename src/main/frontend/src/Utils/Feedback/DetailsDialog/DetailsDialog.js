import React from 'react';
import PropTypes from "prop-types";
import { FullscreenDialog, MultiColumns, TitleBar } from "../../DataDisplay/FullscreenDialog";

function DetailsDialog(props) {
    const {children, onClose, open, optional, title, ...other} = props;

    return (
        <FullscreenDialog onClose={onClose} open={open} {...other}>
            <TitleBar onClose={onClose} optional={optional} title={title}/>
            <MultiColumns>
                {children}
            </MultiColumns>
        </FullscreenDialog>
    );
}

DetailsDialog.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    optional: PropTypes.node,
    title: PropTypes.node,
};

export default DetailsDialog;
