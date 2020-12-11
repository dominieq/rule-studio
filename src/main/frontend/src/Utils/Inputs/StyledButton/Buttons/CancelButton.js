import React from "react";
import StyledButton from "../StyledButton";
import { StyledButtonPropTypes } from "../propTypes";

/**
 * <h3>Overview</h3>
 * The {@link StyledButton} element with "CANCEL" text, secondary colour and outlined styling.
 *
 * @class
 * @category Utils
 * @subcategory Buttons
 * @param {Object} props - All will be forwarded to the {@link StyledButton} element.
 * @returns {React.ReactElement}
 */
function CancelButton(props) {
    const { children, ...other } = props;

    return (
        <StyledButton color={"secondary"} variant={"outlined"} {...other}>
            { children == null ? "Cancel" : children }
        </StyledButton>
    );
}

CancelButton.propTypes = { ...StyledButtonPropTypes };

export default CancelButton;
