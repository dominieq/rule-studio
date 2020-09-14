import React from "react";
import PropTypes from "prop-types";
import { StyledButton } from "../../../../Utils/Inputs/StyledButton";
import Calculator from "mdi-material-ui/Calculator"

/**
 * The {@link StyledButton} element with calculator icon as start icon.
 *
 * @name Calculate Button
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props - Any other props will be forwarded to the {@link StyledButton} element.
 * @param {React.ReactNode} [props.children="Calculate"] - The content of the button.
 * @param {function} props.onClick - Callback fired when the button was clicked on.
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
            {!children ? "Calculate" : children}
        </StyledButton>
    )
}

CalculateButton.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func
};

export default CalculateButton;
