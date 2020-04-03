import React from "react";
import PropTypes from "prop-types";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";

function Cancel(props) {
    const {children, ...other} = props;

    return (
        <StyledButton {...other}>
            {children}
        </StyledButton>
    )
}

Cancel.propTypes = {
    autoFocus: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func,
    themeVariant: PropTypes.oneOf(["inherit", "primary", "secondary"]),
    variant: PropTypes.oneOf(["text", "outlined", "contained"]),
};

Cancel.defaultProps = {
    autoFocus: true,
    children: "Cancel",
    themeVariant: "secondary",
    variant: "outlined",
};

export default Cancel;
