import PropTypes from "prop-types";
import MuiPaperPropTypes from "./MuiPaperPropTypes";

const StyledPaperPropTypes = {
    ...MuiPaperPropTypes,
    className: PropTypes.string,
    paperRef: PropTypes.object
}

export default StyledPaperPropTypes;
