import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import HelpCircle from "mdi-material-ui/HelpCircle";

const useStyles = makeStyles({
    default: {
        color: "#66FF66",
        backgroundColor: "#2A3439"
    },
    small: {
        height: 24,
        width: 24,
    },
    medium: {
        height: 36,
        width: 36,
    },
    big: {
        height: 48,
        width: 48,
    },
    smallIcon: {
        height: "1em",
        width: "1em",
    },
    mediumIcon: {
        height: "1.5em",
        width: "1.5em",
    },
    bigIcon: {
        height: "2.14em",
        width: "2.14em",
    }
}, {name: "MuiAvatar"});

function StyledHelper(props) {
    const {children, size, color} = props;
    const classes =  useStyles();

    return (
        <Tooltip title={children}>
            <Avatar className={clsx(classes[size], classes[color])}>
                <HelpCircle className={classes[size + "Icon"]} color={"inherit"}/>
            </Avatar>
        </Tooltip>
    )
}

StyledHelper.propTypes = {
    children: PropTypes.string.isRequired,
    size: PropTypes.oneOf(["small", "medium", "big"]),
    color: PropTypes.oneOf(["default"])
};

StyledHelper.defaultProps = {
    size: "small",
    color: "default",
};

export default StyledHelper;