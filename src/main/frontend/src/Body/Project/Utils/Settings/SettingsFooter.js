import React from "react";
import PropTypes from "prop-types";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import StyledButton from "../../../../RuleWorkComponents/Inputs/StyledButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCloseThick} from "@mdi/js";

function SettingsFooter(props) {
    const {id, onClose} = props;
    return (
        <RuleWorkSmallBox id={id} styleVariant={"footer"}>
            <StyledButton
                aria-label={"settings-close-button"}
                aria-describedby={id}
                isIcon={true}
                onClick={onClose}
                themeVariant={"secondary"}
            >
                <SvgIcon><path d={mdiCloseThick} /></SvgIcon>
            </StyledButton>
        </RuleWorkSmallBox>
    )
}

SettingsFooter.propTypes = {
    id: PropTypes.string,
    onClose: PropTypes.func.isRequired
};

export default SettingsFooter