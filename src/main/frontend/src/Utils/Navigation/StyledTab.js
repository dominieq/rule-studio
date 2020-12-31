import React from "react";
import { MuiTabPropTypes } from "./propTypes";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.defaultDark,
        minHeight: 48,
        padding: "6px 12px",
        '&:hover': {
            backgroundColor: theme.palette.background.main1Dark,
            color: theme.palette.text.defaultDark
        },
        '&:focus': {
            backgroundColor: theme.palette.background.main1Dark,
            color: theme.palette.text.defaultDark
        }
    },
    textColorInherit: {
        '&.Mui-selected': {
            backgroundColor: theme.palette.background.main1,
            color: theme.palette.text.default
        }
    },
    wrapper: {
        flexDirection: "row"
    }
}), {name: "CustomTab"});

/**
 * <h3>Overview</h3>
 * The Tab component from Material-UI library with custom styling.
 * For full documentation check Material-UI docs on
 * <a href="https://material-ui.com/api/tab/" target="_blank">Tab</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Navigation
 * @param {Object} props - All props will be forwarded to the Tab component.
 * @returns {React.ReactElement}
 */
function StyledTab(props) {
    const { classes: propsClasses, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <Tab classes={{...classes}} {...other} />
    );
}

StyledTab.propTypes = { ...MuiTabPropTypes };

export default StyledTab;
