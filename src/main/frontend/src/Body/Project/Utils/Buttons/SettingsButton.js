import React from "react";
import PropTypes from "prop-types";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import { StyledIconButton } from "../../../../Utils/Inputs/StyledButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCog} from "@mdi/js";

function SettingsButton(props) {
    const { ButtonProps, TooltipProps } = props;

    return (
        <CustomTooltip
            title={"Click to customize parameters"}
            {...TooltipProps}
        >
            <StyledIconButton
                aria-label={"settings button"}
                onClick={props.onClick}
                color={"secondary"}
                {...ButtonProps}
            >
                <SvgIcon><path d={mdiCog} /></SvgIcon>
            </StyledIconButton>
        </CustomTooltip>
    )
}

SettingsButton.propTypes = {
    ButtonProps: PropTypes.object,
    onClick: PropTypes.func,
    TooltipProps: PropTypes.object
};

export default SettingsButton;