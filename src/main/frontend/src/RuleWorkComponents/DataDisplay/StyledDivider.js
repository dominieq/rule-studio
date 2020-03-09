import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles({
    bar: {
        margin: "0 16px",
        backgroundColor: "#2A3439"
    },
    panel: {
        margin: "16px 0",
        height: 1,
        backgroundColor: "#ABFAA9"
    }
}, {name: "styled-divider"});

function StyledDivider(props) {
    const {styleVariant, ...other} = props;
    const classes = useStyles();

    return (
        <Divider className={clsx(classes[styleVariant])} {...other} />
    )
}

StyledDivider.propTypes = {
    flexItem: PropTypes.bool,
    orientation: PropTypes.oneOf(["horizontal", "vertical"]),
    styleVariant: PropTypes.oneOf(["bar", "panel"]),
    variant: PropTypes.oneOf(["fullWidth", "inset", "middle"]),
};

StyledDivider.defaultProps = {
    flexItem: true,
    orientation: "vertical",
    styleVariant: "bar",
    variant: "fullWidth"
};

export default StyledDivider;