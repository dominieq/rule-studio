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

/**
 * A component with built-in styles that you can choose with 'variant' prop.
 * The content is going to be displayed inside of a 'div' element.
 * You can apply special class name to the 'div' element (it customizes scrollbar if it's visible).
 *
 * @constructor
 * @param props {Object} Any other props will be forwarded to 'div' element.
 * @param props.children {React.ReactNode} The content of the component.
 * @param props.className {string} The class name of the component.
 * @param props.customScrollbar {boolean} If <code>true</code> a special class name
 * that styles scrollbar is going to be applied to 'div' element.
 * @param props.variant {string} A string value that determines what style is going to be applied to the component.
 * @returns {React.ReactElement} A 'div' element with content inside of it.
 */
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