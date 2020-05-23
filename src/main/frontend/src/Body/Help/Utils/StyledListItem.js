import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../../../Utils/utilFunctions";
import ListItem from "@material-ui/core/ListItem";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.background.subDark,
        paddingLeft: 4,
        '&.Mui-selected': {
            backgroundColor: "transparent",
            borderLeft: `4px solid ${theme.palette.background.sub}`,
            color: theme.palette.background.sub,
            '&:hover': {
                backgroundColor: "transparent",
                borderLeft: "4px solid currentColor",
                color: "currentColor"
            }
        },
        '&:hover': {
            backgroundColor: "transparent",
            borderLeft: `4px solid ${theme.palette.background.sub}`,
            color: theme.palette.background.sub
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
