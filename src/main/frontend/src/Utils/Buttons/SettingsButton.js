import React from "react";
import PropTypes from "prop-types";
import CustomTooltip from "../DataDisplay/CustomTooltip";
import StyledIconButton from "./StyledButton/StyledIconButton";
import { StyledIconButtonPropTypes } from "./StyledButton/propTypes";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCog} from "@mdi/js";

/**
 * <h3>Overview</h3>
 * The {@link StyledIconButton} with cog icon wrapped around in {@link CustomTooltip}.
 *
 * @constructor
 * @category Buttons
 * @param {Object} props - Any other props will be forwarded to the {@link StyledIconButton} element.
 * @param {Object} props.TooltipProps - Props applied to the {@link CustomTooltip} element.
 * @returns {React.ReactElement}
 */
function SettingsButton(props) {
    const { TooltipProps, ...other } = props;

    return (
        <CustomTooltip title={"Click to customize parameters"} {...TooltipProps}>
            <StyledIconButton aria-label={"settings-button"} color={"secondary"} {...other}>
                <SvgIcon><path d={mdiCog}/></SvgIcon>
            </StyledIconButton>
        </CustomTooltip>
    )
}

SettingsButton.propTypes = {
    ...StyledIconButtonPropTypes,
    TooltipProps: PropTypes.object
};

export default SettingsButton;
