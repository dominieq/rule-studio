import PropTypes from "prop-types";

const StyledIconButtonPropTypes = {
    ButtonRef: PropTypes.object,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(["default", "inherit", "primary", "secondary"]),
    component: PropTypes.elementType,
    disabled: PropTypes.bool,
    disablePadding: PropTypes.bool,
    disableFocusRipple: PropTypes.bool,
    disableRipple: PropTypes.bool,
    edge: PropTypes.oneOf(["start", "end", false]),
    href: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.oneOf(["small", "medium"])
}

export default StyledIconButtonPropTypes;
