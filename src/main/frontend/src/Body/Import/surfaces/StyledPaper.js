import React from 'react';
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        position: "relative",
        top: "-10vh",
        width: "fit-content",
        height: "fit-content",
        padding: "20px",
        color: "#ABFAA9",
        backgroundColor: "#545F66",
    }
});

function StyledPaper(props) {
    const {children, ...other} = props;
    const classes = useStyles();

    return (
        <Paper {...other} classes={{root: classes.root}}>
            {children}
        </Paper>
    )
}

StyledPaper.propTypes = {
    children: PropTypes.any,

};

export default StyledPaper;