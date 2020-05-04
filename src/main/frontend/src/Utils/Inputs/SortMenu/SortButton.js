import React from "react";
import PropTypes from "prop-types";
import CustomTooltip from "../../DataDisplay/CustomTooltip";
import StyledButton from "../StyledButton";
import Sort from "@material-ui/icons/Sort";

function SortButton(props) {
    const { ButtonProps, icon, tooltip, TooltipProps } = props;

    return (
        <CustomTooltip title={tooltip} {...TooltipProps}>
            <StyledButton
                aria-label={"sort button"}
                isIcon={true}
                themeVariant={"secondary"}
                {...ButtonProps}
            >
                { Boolean(icon) ? icon : <Sort /> }
            </StyledButton>
        </CustomTooltip>
    )
}

SortButton.propTypes = {
    ButtonProps: PropTypes.shape({
        'aria-label': PropTypes.any,
        'aria-controls': PropTypes.any,
        'aria-haspopup': PropTypes.bool,
        onClick: PropTypes.func,
    }),
    icon: PropTypes.node,
    tooltip: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object,
};

export default SortButton;
