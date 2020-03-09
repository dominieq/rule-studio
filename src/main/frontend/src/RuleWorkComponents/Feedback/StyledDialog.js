import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";


const useStyles = makeStyles( {
    paper: {
        color: "#ABFAA9",
        backgroundColor: "#545F66"
    }
});

function StyledDialog(props) {
    const {children, open, ...other} = props;
    const classes = useStyles();

    return (
        <Dialog open={open} classes={{paper: classes.paper}} {...other}>
            {children}
        </Dialog>
    )
}

StyledDialog.propTypes = {
    open: PropTypes.bool.isRequired,
};

export default StyledDialog;