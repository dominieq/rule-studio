import React from "react";
import PropTypes from "prop-types";
import CustomTooltip from "../DataDisplay/CustomTooltip";
import StyledIconButton from "./StyledButton/StyledIconButton";
import { StyledIconButtonPropTypes } from "./StyledButton/propTypes";
import MoreVert from "@material-ui/icons/MoreVert";

/**
 * <h3>Overview</h3>
 * The {@link StyledIconButton} with three dots icon, wrapped around in {@link CustomTooltip}.
 *
 * @constructor
 * @category Buttons
 * @param {Object} props - Any other props will be forwarded to the {@link StyledIconButton} element.
 * @param {Object} props.IconProps - Props applied to the icon element.
 * @param {Object} props.TooltipProps - Props applied to the {@link CustomTooltip} element.
 * @returns {React.ReactElement}
 */
function MoreSettingsIconButton(props) {
    const { IconProps, TooltipProps, ...other } = props

    return (
        <CustomTooltip
            title={"Click to customise view"}
            enterDelay={300}
            {...TooltipProps}
        >
            <StyledIconButton
                aria-label={"more-settings-icon-button"}
                disablePadding={true}
                size={"small"}
                {...other}
            >
                <MoreVert {...IconProps} />
            </StyledIconButton>
        </CustomTooltip>
    )
}

MoreSettingsIconButton.propTypes = {
    ...StyledIconButtonPropTypes,
    IconProps: PropTypes.object,
    TooltipProps: PropTypes.object
}

export default MoreSettingsIconButton;
