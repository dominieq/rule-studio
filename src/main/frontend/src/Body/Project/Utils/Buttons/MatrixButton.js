import React from "react";
import PropTypes from "prop-types";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import { StyledIconButton } from "../../../../Utils/Inputs/StyledButton";
import Matrix from "mdi-material-ui/Matrix";

function MatrixButton(props) {
    const {title, ...other} = props;
    
    return (
        <CustomTooltip id={"matrix-button-tooltip"} title={title}>
            <StyledIconButton
                aria-label={"matrix-button"}
                color={"secondary"}
                {...other}
            >
                <Matrix />
            </StyledIconButton>
        </CustomTooltip>
    )

}

MatrixButton.propTypes = {
    ButtonProps: PropTypes.object,
    onClick: PropTypes.func,
    title: PropTypes.string.isRequired,
    TooltipProps: PropTypes.object
};

export default MatrixButton;