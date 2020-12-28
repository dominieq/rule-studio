import React from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Tooltip from "@material-ui/core/Tooltip";

// To get unblurred tooltip text in Google Chrome
const disableGpuProps = {
    popperOptions: {
        modifiers: {
            computeStyle: {
                enabled: true,
                gpuAcceleration: false
            }
        }
    }
};

const useStyles = makeStyles(theme => ({
    arrow: {
        color: theme.palette.background.sub
    },
    disableMaxWidth: {
        maxWidth: "none"
    },
    tooltip: {
        backgroundColor: theme.palette.background.sub,
        boxShadow: theme.shadows[6],
        color: theme.palette.text.main2,
        fontSize: "smaller"
    },
    wrapper: {}
}), {name: "CustomTooltip"});

function DefaultWrapper(props, ref) {
    const { children, component, ...other } = props;
    return React.createElement(component, {ref, ...other}, children)
}

const WrapperForwardRef = React.forwardRef(DefaultWrapper);

/**
 * <h3>Overview</h3>
 * The Tooltip component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/tooltip/" target="_blank">Tooltip</a>.
 *
 * <h3>Usage</h3>
 * There is a custom <code>Wrapper</code> element that can hold reference.
 * This composition enables you to forward children without the ability to hold ref to the Tooltip component.
 *
 * @constructor
 * @category Utils
 * @subcategory Data Display
 * @param {Object} props - Any other props will be forwarded to the Tooltip component.
 * @param {Object} [props.classes] - Override or extend the styles applied to the component.
 * @param {string} [props.className] - The class name of the Wrapper element.
 * @param {boolean} [props.disableGpu=true] - If <code>true</code> GPU acceleration will be disabled. <br>
 *     Disable GPU acceleration to get unblurred tooltip text in Google Chrome.
 * @param {boolean} [props.disableMaxWidth=false] - If <code>true</code> <code>maxWidth</code> property will be set to "none".
 * @param {React.ElementType} [props.WrapperComponent=div] - The component used for the wrapper element.
 * @param {Object} [props.WrapperProps] - Props applied to the <code>Wrapper</code> element.
 * @returns {React.ReactElement}
 */
function CustomTooltip(props) {
    const {
        children,
        classes: propsClasses,
        className,
        disableGpu,
        disableMaxWidth,
        PopperProps,
        WrapperComponent,
        WrapperProps,
        ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    if (disableMaxWidth) {
        classes = mergeClasses(classes, {tooltip: classes.disableMaxWidth})
    }

    let newPopperProps = { ...PopperProps };
    if (disableGpu) {
        newPopperProps = { ...PopperProps, ...disableGpuProps };
    }

    return (
        <Tooltip
            classes={{tooltip: classes.tooltip, arrow: classes.arrow}}
            PopperProps={{...newPopperProps}}
            {...other}
        >
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
    disableGpu: PropTypes.bool,
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
    disableGpu: true,
    WrapperComponent: 'div'
};

export default CustomTooltip;
