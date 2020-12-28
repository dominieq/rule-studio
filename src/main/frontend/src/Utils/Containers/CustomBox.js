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
 * <h3>Overview</h3>
 * A container with four custom styles applied via <code>variant</code> property.
 *
 * <h3>Usage</h3>
 * In order to provide scrollbar with custom styling set <code>customScrollbar</code> property to <code>true</code>.
 *
 * @constructor
 * @category Utils
 * @subcategory Containers
 * @param {Object} props - Any other props will be forwarded to the root element.
 * @param {React.ReactNode} props.children - The content of the component.
 * @param {string} props.className - The class attribute of the root element.
 * @param {boolean} props.customScrollbar - If <code>true</code> scrollbar will have custom styling.
 * @param {"Body"|"Tab"|"TabBody"|"TabScrollable"} props.variant - The variant of the component.
 * @returns {React.ReactElement}
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
