import React from "react";
import PropTypes from "prop-types";

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