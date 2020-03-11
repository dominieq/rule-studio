import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStylesDefault = makeStyles({
    bar: {
        position: "relative",
        padding: "2px 15px 2px",
        color: "#ABFAA9",
        backgroundColor: "#545F66",
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
        color: "#ABFAA9",
        backgroundColor: "#545F66",
    }
}, {name: "rule-work"});

function StyledPaper(props) {
    const {children, styleVariant, paperRef, ...other} = props;
    const classesDefault = useStylesDefault();

    return (
            <Paper
                className={clsx(classesDefault[styleVariant])}
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
    styleVariant: PropTypes.oneOf(["bar", "panel"]),
};

StyledPaper.defaultProps = {
    styleVariant: "bar"
};

export default StyledPaper;