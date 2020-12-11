import React from "react";
import StyledButton from "../StyledButton";
import { StyledButtonPropTypes } from "../propTypes"

/**
 * <h3>Overview</h3>
 * The {@link StyledButton} element with "OK" text, primary colour and outlined styling.
 *
 * @class
 * @category Utils
 * @subcategory Buttons
 * @param {Object} props - All will be forwarded to the {@link StyledButton} element.
 * @returns {React.ReactElement}
 */
function AcceptButton(props) {
    const { children, ...other } = props;

    return (
        <StyledButton color={"primary"} variant={"outlined"} {...other}>
            { children == null ? "Ok" : children }
        </StyledButton>
    );
}

AcceptButton.propTypes = { ...StyledButtonPropTypes };

export default AcceptButton;
