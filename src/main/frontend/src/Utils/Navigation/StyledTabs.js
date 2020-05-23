import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Tabs from "@material-ui/core/Tabs";

const useStyles = makeStyles(theme => ({
    indicator: {
        backgroundColor: theme.palette.background.main1
    }
}), {name: "CustomTabs"});

function StyledTabs(props) {
    const { classes: propsClasses, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <Tabs centered={true} classes={{...classes}} {...other} />
    );
}

StyledTabs.propTypes = {
    action: PropTypes.object,
    "aria-label": PropTypes.string,
    "aria-labelledby": PropTypes.string,
    centered: PropTypes.bool,
    children: PropTypes.node,
    classes: PropTypes.object,
    component: PropTypes.elementType,
    indicatorColor: PropTypes.oneOf(["primary", "secondary"]),
    onChange: PropTypes.func,
    orientation: PropTypes.oneOf(["horizontal", "vertical"]),
    ScrollButtonComponent: PropTypes.elementType,
    scrollButtons: PropTypes.oneOf(["auto", "desktop", "on", "off"]),
    selectionFollowFocus: PropTypes.bool,
    TabIndicatorProps: PropTypes.object,
    TabScrollButtonProps: PropTypes.object,
    textColor: PropTypes.oneOf(["inherit", "primary", "secondary"]),
    value: PropTypes.any,
    variant: PropTypes.oneOf(["standard", "scrollable", "fullwidth"])
};

export default StyledTabs;
