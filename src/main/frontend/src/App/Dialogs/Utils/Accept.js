import React from "react";
import PropTypes from "prop-types";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";

function Accept(props) {
    const {children, ...other} = props;

    return (
        <StyledButton {...other}>
            {children}
        </StyledButton>
    )
}

Accept.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    themeVariant: PropTypes.oneOf(["inherit", "primary", "secondary"]),
    variant: PropTypes.oneOf(["text", "outlined", "contained"])
};

Accept.defaultProps = {
    children: "Ok",
    disabled: true,
    themeVariant: "primary",
    variant: "outlined",
};

export default Accept;
