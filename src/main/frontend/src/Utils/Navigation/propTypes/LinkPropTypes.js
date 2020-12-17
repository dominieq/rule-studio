import PropTypes from "prop-types";

const LinkPropTypes = {
    to: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            pathname: PropTypes.string,
            search: PropTypes.string,
            hash: PropTypes.string,
            state: PropTypes.object
        }),
        PropTypes.func
    ]),
    replace: PropTypes.bool,
    innerRef: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    component: PropTypes.elementType
}

export default LinkPropTypes;
