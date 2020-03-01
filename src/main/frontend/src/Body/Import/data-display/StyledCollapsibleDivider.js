import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import "./StyledCollapsibleDivider.css";

const useStyles = makeStyles(theme => ({
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
    const classes =  useStyles();

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

function StyledCollapsibleDivider(props) {
    const {onClick, expanded} = props;

    return (
        <div onClick={onClick} className={"styled-collapsible-divider"}>
            <ExpandButton expanded={expanded} />
            <div className={"divider-label"}>
                Optional files
            </div>
            <div className={"divider-horizontal-line"}/>
        </div>
    )
}

StyledCollapsibleDivider.propTypes = {
    onClick: PropTypes.func,
    expanded: PropTypes.bool,
};

export default StyledCollapsibleDivider
