import React from "react";
import PropTypes from "prop-types";
import { StyledButton } from "../../../Utils/Inputs/StyledButton";

/**
 * The {@link StyledButton} element with "CANCEL" text and with secondary and outlined styling.
 *
 * @name CancelButton
 * @class
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props - Any other props will be forwarded to the {@link StyledButton} element.
 * @param {React.ReactNode} [props.children = "Cancel"] - The content of the button.
 * @param {function} props.onClick - Callback fired when the button was clicked on.
 * @returns {React.ReactElement}
 */
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
