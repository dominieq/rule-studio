import React from "react";
import PropTypes from "prop-types";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import StyledButton from "../../../../Utils/Inputs/StyledButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCog} from "@mdi/js";

function SettingsButton(props) {
    return (
        <CustomTooltip title={"Click to customize parameters"}>
            <StyledButton
                aria-label={"settings button"}
                isIcon={true}
                themeVariant={"secondary"}
                {...props}
            >
                <SvgIcon><path d={mdiCog} /></SvgIcon>
            </StyledButton>
        </CustomTooltip>
    )
}

SettingsButton.propTypes = {
    onClick: PropTypes.func,
};

export default SettingsButton;