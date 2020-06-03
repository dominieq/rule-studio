import React from "react";
import PropTypes from "prop-types";
import { StyledButton } from "../../../../Utils/Inputs/StyledButton";
import Calculator from "mdi-material-ui/Calculator"

function CalculateButton(props) {
    const {children, ...other} = props;

    return (
        <StyledButton
            color={"primary"}
            disableElevation={true}
            startIcon={<Calculator />}
            variant={"contained"}
            {...other}
        >
            {!children ? "Calculate" : children}
        </StyledButton>
    )
}

CalculateButton.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func
};

export default CalculateButton;
