import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStylesButton = makeStyles(theme => ({
    root: {
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
    const classes =  useStylesButton();

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

const useStylesDivider = makeStyles({
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
        color: "#2A3439",
        minWidth: "fit-content",
        marginRight: "1em",
        marginTop: "-1px",
    },
    'horizontal-line': {
        height: "1px",
        width: "100%",
        backgroundColor: "#2A3439",
    },
}, {name: "styled-collapsible-divider"});

function RuleWorkCollapsibleDivider(props) {
    const {onClick, expanded} = props;
    const classes = useStylesDivider();

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

RuleWorkCollapsibleDivider.propTypes = {
    onClick: PropTypes.func,
    expanded: PropTypes.bool,
};

export default RuleWorkCollapsibleDivider
