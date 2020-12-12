import React from "react";
import StyledButton from "./StyledButton/StyledButton";
import { StyledButtonPropTypes } from "./StyledButton/propTypes"

/**
 * <h3>Overview</h3>
 * The {@link StyledButton} element with "OK" text, primary colour and outlined styling.
 *
 * @constructor
 * @category Buttons
 * @param {Object} props - All props will be forwarded to the {@link StyledButton} element.
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
