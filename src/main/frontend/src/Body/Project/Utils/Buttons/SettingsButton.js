import React from "react";
import PropTypes from "prop-types";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import StyledButton from "../../../../Utils/Inputs/StyledButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCog} from "@mdi/js";

function SettingsButton(props) {
    const {title, ...other} = props;

    return (
        <CustomTooltip title={title}>
            <StyledButton isIcon={true} themeVariant={"secondary"} {...other}>
                <SvgIcon><path d={mdiCog} /></SvgIcon>
            </StyledButton>
        </CustomTooltip>
    )
}

SettingsButton.propTypes = {
    'aria-label': PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default SettingsButton;