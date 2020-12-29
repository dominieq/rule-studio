import PropTypes from "prop-types";

const MuiFormControlLabelPropTypes = {
    checked: PropTypes.bool,
    classes: PropTypes.object,
    control: PropTypes.element.isRequired,
    disabled: PropTypes.bool,
    inputRef: PropTypes.object,
    label: PropTypes.node,
    labelPlacement: PropTypes.oneOf(["bottom", "end", "start", "top"]),
    onChange: PropTypes.func,
    value: PropTypes.any
}

export default MuiFormControlLabelPropTypes;
