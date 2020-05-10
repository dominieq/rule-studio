import React from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
    arrow: {
        color: theme.palette.popper.background
    },
    disableMaxWidth: {
        maxWidth: "none"
    },
    tooltip: {
        backgroundColor: theme.palette.popper.background,
        boxShadow: theme.shadows[6],
        color: theme.palette.popper.text,
        fontSize: "smaller"
    },
    wrapper: {}
}), {name: "CustomTooltip"});

function DefaultWrapper(props, ref) {
    const { children, component, ...other } = props;
    return React.createElement(component, {ref, ...other}, children)
}

const WrapperForwardRef = React.forwardRef(DefaultWrapper);

function CustomTooltip(props) {
    const { children,  classes: propsClasses, className, disableMaxWidth, WrapperComponent, WrapperProps, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    if (disableMaxWidth) {
        classes = mergeClasses(classes, {tooltip: classes.disableMaxWidth})
    }

    return (
        <Tooltip classes={{tooltip: classes.tooltip, arrow: classes.arrow}} {...other}>
            <WrapperForwardRef
                className={clsx(classes.wrapper, className)}
                component={WrapperComponent}
                {...WrapperProps}
            >
                {children}
            </WrapperForwardRef>
        </Tooltip>
    )
}

CustomTooltip.propTypes = {
    arrow: PropTypes.bool,
    children: PropTypes.node,
    classes: PropTypes.shape({
        arrow: PropTypes.string,
        disableMaxWidth: PropTypes.string,
        tooltip: PropTypes.string,
        wrapper: PropTypes.string
    }),
    className: PropTypes.string,
    disableFocusListener: PropTypes.bool,
    disableHoverListener: PropTypes.bool,
    disableTouchListener: PropTypes.bool,
    disableMaxWidth: PropTypes.bool,
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

CustomTooltip.defaultProps = {
    WrapperComponent: 'div'
};

export default CustomTooltip;
