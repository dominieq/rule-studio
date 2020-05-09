import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./styles/CustomBox.module.css";

function CustomBox(props) {
    const { className, variant, ...other } =  props;

    return (
        <div className={clsx(styles[variant], className)} {...other} />
    )
}

CustomBox.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    variant: PropTypes.oneOf(["Body", "Tab", "TabBody", "TabScrollable"])
};

export default CustomBox;