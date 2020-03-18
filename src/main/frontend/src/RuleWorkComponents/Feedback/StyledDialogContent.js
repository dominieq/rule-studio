import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    dividers: {
        borderTopColor: "#6BD425",
        borderBottomColor: "#6BD425",
    }
},{name: "MuiDialogContent"});

function StyledDialogContent(props) {
    const {children, classes: propsClasses, ...other} = props;
    const classes = {...useStyles(), ...propsClasses};

    return (
        <DialogContent classes={{...classes}} {...other}>
            {children}
        </DialogContent>
    )
}

StyledDialogContent.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    dividers: PropTypes.bool,
};

StyledDialogContent.defaultProps = {
    dividers: true,
};

export default StyledDialogContent;