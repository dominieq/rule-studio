import PropTypes from "prop-types";

const ButtonWithTooltipPropTypes = {
    tooltip: PropTypes.string.isRequired,
    tooltipId: PropTypes.string,
    TooltipProps: PropTypes.object
};

export default ButtonWithTooltipPropTypes;
