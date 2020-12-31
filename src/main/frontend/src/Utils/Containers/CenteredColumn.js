import React from "react";
import PropTypes from "prop-types";

/**
 * <h3>Overview</h3>
 * A container that centers auto-sizing child. The outer wrapper element takes care of the width of a child.
 * It takes all space given by a parent and centers the inner wrapper.
 * The inner wrapper element takes care of the height of a child. It takes all width given by an outer wrapper.
 *
 * <h3>Usage</h3>
 * This component should have a single child - an AutoSizer from react-virtualized.
 * In order to fully utilize this component's features, place it in an element that has 100% width and height.
 *
 * @constructor
 * @category Utils
 * @subcategory Containers
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content of the component.
 * @param {number|string} props.height - The height of the InnerWrapper. Should be the same as the height of a child.
 * @param {number|string} [props.maxWidth=100%] - The max-width attribute of the OuterWrapper.
 * @param {number|string} [props.minWidth=0%] - The min-width attribute of the OuterWrapper.
 * @param {Object} [props.InnerWrapperProps] - Props applied to the InnerWrapper element.
 * @param {Object} [props.OuterWrapperProps] - Props applied to the OuterWrapper element.
 * @param {number|string} props.width - The width of the OuterWrapper. Should be the same as the width of a child.
 * @returns {React.ReactElement}
 */
function CenteredColumn(props) {
    const { children, height, maxWidth, minWidth, InnerWrapperProps, OuterWrapperProps, width } = props;

    return (
        <div
            aria-label={"outer-wrapper"}
            style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                maxWidth: maxWidth,
                minWidth: minWidth,
                width: width
            }}
            {...OuterWrapperProps}
        >
            <div
                aria-label={"inner-wrapper"}
                style={{
                    height: height,
                    maxHeight: "100%",
                    minHeight: "0%",
                    width: "100%"
                }}
                {...InnerWrapperProps}
            >
                {children}
            </div>
        </div>
    )
}

CenteredColumn.propTypes = {
    children: PropTypes.node.isRequired,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    InnerWrapperProps: PropTypes.object,
    OuterWrapperProps: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

CenteredColumn.defaultProps = {
    maxWidth: "100%",
    minWidth: "0%"
};

export default CenteredColumn;
