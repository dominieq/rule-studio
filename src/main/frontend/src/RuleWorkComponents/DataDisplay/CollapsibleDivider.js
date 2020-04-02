import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const expandStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.paper.text,
        padding: 0,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginRight: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(90deg)',
    },
}));

function ExpandButton(props) {
    const expanded = props.expanded;
    const classes =  expandStyles();

    return (
        <IconButton
            aria-expanded={expanded}
            aria-label={"expand-more"}
            className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
            })}
            classes={{root: classes.root}}
        >
            <ChevronRightIcon />
        </IconButton>
    )
}

const dividerStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        cursor: "pointer",
    },
    label: {
        fontSize: "smaller",
        color: theme.palette.paper.text,
        minWidth: "fit-content",
        marginRight: "1em",
        marginTop: "-1px",
    },
    'horizontal-line': {
        height: "1px",
        width: "100%",
        backgroundColor: theme.palette.paper.text,
    },
}), {name: "collapsible-divider"});

function CollapsibleDivider(props) {
    const {onClick, expanded} = props;
    const classes = dividerStyles();

    return (
        <div onClick={onClick} className={classes.root}>
            <ExpandButton expanded={expanded} />
            <div className={classes.label}>
                Optional files
            </div>
            <div className={classes['horizontal-line']}/>
        </div>
    )
}

CollapsibleDivider.propTypes = {
    onClick: PropTypes.func,
    expanded: PropTypes.bool,
};

export default CollapsibleDivider
