import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles/CustomBox.module.css";

const useStyles = makeStyles(theme => ({
    Root: {
        '&::-webkit-scrollbar': {
            width: 17
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.background.sub,
            '&:hover': {
                backgroundColor: theme.palette.background.subDark
            }
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)"
        }
    }
}), {name: "TabScroll"});

function CustomBox(props) {
    const { className, customScrollbar, variant, ...other } =  props;
    const classes = useStyles();

    return (
        <div className={clsx(styles[variant], {[classes.Root]: customScrollbar}, className)} {...other} />
    )
}

CustomBox.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    customScrollbar: PropTypes.bool,
    variant: PropTypes.oneOf(["Body", "Tab", "TabBody", "TabScrollable"])
};

CustomBox.defaultProps = {
    customScrollbar: false
};

export default CustomBox;