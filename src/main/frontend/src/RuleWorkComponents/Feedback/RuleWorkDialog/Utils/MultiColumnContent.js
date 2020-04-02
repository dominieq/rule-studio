import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";

const contentStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        margin: "2.5%",
        overflow: "hidden",
        padding: 0,
        '& > *': {
            paddingBottom: 1,
            width: "30%"
        }
    }
}, {name: "MuiDialogContent"});

function MultiColumnContent(props) {
    const contentClasses = contentStyles();

    return (
        <DialogContent classes={{root: contentClasses.root}}>
            {props.children}
        </DialogContent>
    )
}

MultiColumnContent.propTypes = {
    children: PropTypes.node,
};

export default MultiColumnContent;