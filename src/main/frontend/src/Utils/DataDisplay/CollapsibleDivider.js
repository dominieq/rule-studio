import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const expandStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.main1,
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
        color: theme.palette.text.main1,
        minWidth: "fit-content",
        marginRight: "1em",
        marginTop: "-1px",
    },
    'horizontal-line': {
        height: "1px",
        width: "100%",
        backgroundColor: theme.palette.text.main1,
    },
}), {name: "collapsible-divider"});

/**
 * A horizontal divider with an arrow button at the beginning.
 * The arrow is going to point different directions - rightwards or downwards, based on expanded property.
 *
 * @constructor
 * @param props {Object}
 * @param [props.onClick] {function} - Callback fired when the component was clicked on.
 * @param [props.expanded] {boolean} - If <code>true</code> the {@link ExpandButton} will be pointing downwards.
 * @returns {React.ReactElement} A 'div' element.
 */
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
