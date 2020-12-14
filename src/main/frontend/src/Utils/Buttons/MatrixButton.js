import React from "react";
import CustomTooltip from "../DataDisplay/CustomTooltip";
import StyledIconButton from "./StyledButton/StyledIconButton";
import { ButtonWithTooltipPropTypes, StyledIconButtonPropTypes } from "./StyledButton/propTypes";
import Matrix from "mdi-material-ui/Matrix";

/**
 * <h3>Overview</h3>
 * The {@link StyledIconButton} with matrix icon wrapped around in {@link CustomTooltip}.
 *
 * @constructor
 * @category Buttons
 * @param {Object} props - Any other props will be forwarded to {@link StyledIconButton} element.
 * @param {string} props.tooltip - The title of the {@link CustomTooltip} element.
 * @param {string} props.tooltipId - The id of the {@link CustomTooltip} element.
 * @param {Object} props.TooltipProps - Props applied to the {@link CustomTooltip} element.
 * @returns {React.ReactElement}
 */
function MatrixButton(props) {
    const { tooltip, tooltipId, TooltipProps, ...other } = props;
    
    return (
        <CustomTooltip id={tooltipId} title={tooltip} {...TooltipProps}>
            <StyledIconButton aria-label={"matrix-button"} color={"secondary"} {...other}>
                <Matrix />
            </StyledIconButton>
        </CustomTooltip>
    );
}

MatrixButton.propTypes = {
    ...StyledIconButtonPropTypes,
    ...ButtonWithTooltipPropTypes
};

export default MatrixButton;
