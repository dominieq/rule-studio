import PropTypes from "prop-types";

const CustomFormLabelPropTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["primary", "secondary"]),
    component: PropTypes.elementType,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    filled: PropTypes.bool,
    focused: PropTypes.bool,
    required: PropTypes.bool
}

export default CustomFormLabelPropTypes;
