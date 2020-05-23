import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../../../Utils/utilFunctions";
import ListItem from "@material-ui/core/ListItem";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.defaultDark,
        paddingLeft: 4,
        '&.Mui-selected': {
            backgroundColor: "transparent",
            borderLeft: `4px solid ${theme.palette.text.default}`,
            color: theme.palette.text.default,
            '&:hover': {
                backgroundColor: "transparent",
                borderLeft: "4px solid currentColor",
                color: "currentColor"
            }
        },
        '&:hover': {
            backgroundColor: "transparent",
            borderLeft: `4px solid ${theme.palette.text.defaultLight}`,
            color: theme.palette.text.defaultLight
        }
    }
}), {name: "ChapterNav"});

function StyledListItem(props) {
    const { classes: propsClasses, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <ListItem
            button={true}
            classes={{...classes}}
            dense={true}
            disableGutters={true}
            disableRipple={true}
            disableTouchRipple={true}
            {...other}
        />
    );
}

StyledListItem.propTypes = {
    alignItems: PropTypes.oneOf(["flex-start", "center"]),
    autoFocus: PropTypes.bool,
    button: PropTypes.bool,
    children: PropTypes.node,
    classes: PropTypes.object,
    component: PropTypes.elementType,
    ContainerComponent: PropTypes.elementType,
    ContainerProps: PropTypes.object,
    dense: PropTypes.bool,
    disabled: PropTypes.bool,
    disableGutters: PropTypes.bool,
    divider: PropTypes.bool,
    selected: PropTypes.bool
};

export default StyledListItem;
