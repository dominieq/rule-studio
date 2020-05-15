import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.tab.textIdle,
        minHeight: 48,
        padding: "6px 12px",
        '&:hover': {
            backgroundColor: theme.palette.tab.backgroundAction,
            color: theme.palette.tab.textAction
        },
        '&:focus': {
            backgroundColor: theme.palette.tab.backgroundAction,
            color: theme.palette.tab.textAction
        }
    },
    textColorInherit: {
        '&.Mui-selected': {
            backgroundColor: theme.palette.tab.background,
            color: theme.palette.tab.text
        }
    },
    wrapper: {
        flexDirection: "row"
    }
}), {name: "CustomTab"});

function StyledTab(props) {
    const { classes: propsClasses, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <Tab classes={{...classes}} {...other} />
    );
}

StyledTab.propTypes = {
    classes: PropTypes.object,
    disabled: PropTypes.bool,
    disableFocusRipple: PropTypes.bool,
    disableRipple: PropTypes.bool,
    icon: PropTypes.node,
    label: PropTypes.node,
    value: PropTypes.any,
    wrapped: PropTypes.bool
};

export default StyledTab;
