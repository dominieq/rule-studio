import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
    paper: {
        color: "#ABFAA9",
        backgroundColor: "#545F66",
    },
    bar: {
        position: "relative",
        padding: "2px 15px 2px",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        zIndex: 2,
    },
    panel: {
        position: "relative",
        width: "fit-content",
        height: "fit-content",
        padding: "8px 16px",
    },
    popper: {
        backgroundColor: "#ABFAA9",
        border: "1px solid #66FF66",
        color: "#2A3439",
        marginTop: "1px",
    }
}, {name: "rule-work"});

function StyledPaper(props) {
    const {children, styleVariant, paperRef, ...other} = props;
    const classes = useStyles();

    return (
            <Paper
                className={clsx(classes.paper, classes[styleVariant])}
                {...paperRef ? {ref: paperRef} : null}
                {...other}
            >
                {children}
            </Paper>
    )
}

StyledPaper.propTypes = {
    children: PropTypes.node,
    paperRef: PropTypes.object,
    styleVariant: PropTypes.oneOf(["bar", "panel", "popper"]),
};

StyledPaper.defaultProps = {
    styleVariant: "bar"
};

export default StyledPaper;