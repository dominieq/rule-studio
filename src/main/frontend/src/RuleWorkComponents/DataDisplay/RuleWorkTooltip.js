import React from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
    tooltip: {
        backgroundColor: theme.palette.paper.text,
        border: "1px solid",
        borderColor: theme.palette.background.default,
        color: theme.palette.background.default,
    },
    wrapper: {

    }
}), {name: "custom-tooltip"});

function DefaultElement(props, ref) {
    const {children, ...other} = props;

    return (
        <div ref={ref} {...other}>
            {children}
        </div>
    )
}

const DefaultForwardRef = React.forwardRef(DefaultElement);

function RuleWorkTooltip(props) {
    const {children, classes: propsClasses, ...other} = props;
    let classes = useStyles();

    if (propsClasses) {
        classes = {
            ...classes,
            ...Object.keys(propsClasses).map(key => {
                if (Object.keys(classes).includes(key)) {
                    return {[key]: clsx(classes[key], propsClasses[key])};
                } else {
                    return {...propsClasses[key]};
                }
            }).reduce((previousValue, currentValue) => {
                return { ...previousValue, ...currentValue };
            })
        };
    }

    return (
        <Tooltip classes={{tooltip: classes.tooltip}} {...other}>
            <DefaultForwardRef className={classes.wrapper}>
                {children}
            </DefaultForwardRef>
        </Tooltip>
    )
}

RuleWorkTooltip.propTypes = {
    arrow: PropTypes.bool,
    children: PropTypes.node,
    classes: PropTypes.object,
    disableFocusListener: PropTypes.bool,
    disableHoverListener: PropTypes.bool,
    disableTouchListener: PropTypes.bool,
    enterDelay: PropTypes.number,
    enterNextDelay: PropTypes.number,
    enterTouchDelay: PropTypes.number,
    id: PropTypes.string,
    interactive: PropTypes.bool,
    leaveDelay: PropTypes.number,
    leaveTouchDelay: PropTypes.number,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    open: PropTypes.bool,
    placement: PropTypes.oneOf([
        "bottom-end",
        "bottom-start",
        "bottom",
        "left-start",
        "left-end",
        "left",
        "right-start",
        "right-end",
        "right",
        "top-start",
        "top-end",
        "top"
    ]),
    PopperProps: PropTypes.object,
    title: PropTypes.node.isRequired,
    TransitionComponent: PropTypes.elementType,
    TransitionProps: PropTypes.object,
};

export default RuleWorkTooltip;