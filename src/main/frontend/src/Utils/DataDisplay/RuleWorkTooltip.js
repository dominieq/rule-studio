import React from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
    tooltip: {
        backgroundColor: theme.palette.popper.background,
        boxShadow: theme.shadows[6],
        color: theme.palette.popper.text,
    },
    arrow: {
        color: theme.palette.popper.background
    },
    wrapper: {

    }
}), {name: "CustomTooltip"});

function DefaultElement(props, ref) {
    const { children, component, ...other } = props;
    return React.createElement(component, {ref, ...other}, children)
}

const DefaultForwardRef = React.forwardRef(DefaultElement);

function RuleWorkTooltip(props) {
    const { children,  classes: propsClasses, className, WrapperComponent, WrapperProps, ...other } = props;
    let classes = useStyles();

    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <Tooltip classes={{tooltip: classes.tooltip, arrow: classes.arrow}} {...other}>
            <DefaultForwardRef
                className={clsx(classes.wrapper, className)}
                component={WrapperComponent}
                {...WrapperProps}
            >
                {children}
            </DefaultForwardRef>
        </Tooltip>
    )
}

RuleWorkTooltip.propTypes = {
    arrow: PropTypes.bool,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
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
    WrapperComponent: PropTypes.elementType,
    WrapperProps: PropTypes.object
};

RuleWorkTooltip.defaultProps = {
    WrapperComponent: 'div'
};

export default RuleWorkTooltip;
