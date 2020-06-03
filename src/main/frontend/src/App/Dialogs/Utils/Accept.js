import React from "react";
import PropTypes from "prop-types";
import { StyledButton } from "../../../Utils/Inputs/StyledButton";

function Accept(props) {
    const { children, ...other } = props;

    return (
        <StyledButton color={"primary"} variant={"outlined"} {...other}>
            { children == null ? "Ok" : children }
        </StyledButton>
    );
}

Accept.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func
};

export default Accept;
