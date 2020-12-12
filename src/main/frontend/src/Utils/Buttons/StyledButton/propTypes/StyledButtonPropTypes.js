import PropTypes from "prop-types";

const StyledButtonPropTypes = {
    ButtonRef: PropTypes.object,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(["default", "inherit", "primary", "secondary"]),
    component: PropTypes.elementType,
    disabled: PropTypes.bool,
    disableElevation: PropTypes.bool,
    disableFocusRipple: PropTypes.bool,
    disableRipple: PropTypes.bool,
    endIcon: PropTypes.node,
    fullWidth: PropTypes.bool,
    href: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    startIcon: PropTypes.node,
    variant: PropTypes.oneOf(["text", "outlined", "contained"])
}

export default StyledButtonPropTypes;
