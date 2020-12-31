import PropTypes from "prop-types";

const StyledSwitchPropTypes = {
    checked: PropTypes.bool,
    checkedIcon: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(["default", "primary", "secondary"]),
    disabled: PropTypes.bool,
    disableRipple: PropTypes.bool,
    edge: PropTypes.oneOf(["end", "start", false]),
    icon: PropTypes.node,
    id: PropTypes.string,
    inputProps: PropTypes.object,
    inputRef: PropTypes.object,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    size: PropTypes.oneOf(["medium", "small"]),
    style: PropTypes.object,
    value: PropTypes.any
}

export default StyledSwitchPropTypes;
