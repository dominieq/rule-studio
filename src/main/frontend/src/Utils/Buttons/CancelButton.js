import React from "react";
import StyledButton from "./StyledButton/StyledButton";
import { StyledButtonPropTypes } from "./StyledButton/propTypes";

/**
 * <h3>Overview</h3>
 * The {@link StyledButton} element with "CANCEL" text, secondary colour and outlined styling.
 *
 * @constructor
 * @category Buttons
 * @param {Object} props - All props will be forwarded to the {@link StyledButton} element.
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
