import React from "react";
import PropTypes from "prop-types";
import { StyledButton } from "../../../Utils/Inputs/StyledButton";

function Cancel(props) {
    const { children, ...other } = props;

    return (
        <StyledButton color={"secondary"} variant={"outlined"} {...other}>
            { children == null ? "Cancel" : children }
        </StyledButton>
    );
}

Cancel.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func
};

export default Cancel;
