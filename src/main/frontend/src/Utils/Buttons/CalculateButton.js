import React from "react";
import StyledButton from "./StyledButton/StyledButton";
import { StyledButtonPropTypes } from "./StyledButton/propTypes";
import Calculator from "mdi-material-ui/Calculator"

/**
 * <h3>Overview</h3>
 * The {@link StyledButton} element with calculator icon as a start icon.
 *
 * @constructor
 * @category Buttons
 * @param {Object} props - All props will be forwarded to the {@link StyledButton} element.
 * @returns {React.ReactElement}
 */
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
            { children == null ? "Calculate" : children }
        </StyledButton>
    )
}

CalculateButton.propTypes = { ...StyledButtonPropTypes };

export default CalculateButton;
