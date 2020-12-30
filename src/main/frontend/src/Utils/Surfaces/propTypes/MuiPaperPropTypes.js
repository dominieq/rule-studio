import PropTypes from "prop-types";

const MuiPaperPropTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    component: PropTypes.elementType,
    elevation: PropTypes.number,
    square: PropTypes.bool,
    variant: PropTypes.oneOf(["elevation", "outlined"]),
}

export default MuiPaperPropTypes;
