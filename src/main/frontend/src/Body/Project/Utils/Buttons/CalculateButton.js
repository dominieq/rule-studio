import React from "react";
import PropTypes from "prop-types";
import StyledButton from "../../../../RuleWorkComponents/Inputs/StyledButton";
import Calculator from "mdi-material-ui/Calculator"

function CalculateButton(props) {
    const {children, ...other} = props;

    return (
        <StyledButton startIcon={<Calculator />} {...other}>
            {!children ? "Calculate" : children}
        </StyledButton>
    )
}

CalculateButton.propTypes = {
    'aria-label': PropTypes.string,
    children: PropTypes.node,
    disabled: PropTypes.bool.isRequired,
    disableElevation: PropTypes.bool,
    onClick: PropTypes.func,
    themeVariant: PropTypes.oneOf(["inherit", "primary", "secondary"]),
    variant: PropTypes.oneOf(["text", "outlined", "contained"])
};

CalculateButton.defaultProps = {
    disableElevation: true,
    themeVariant: "primary",
    variant: "contained"
};

export default CalculateButton;