import React from "react";
import PropTypes from "prop-types";
import { StyledButton } from "../../../Utils/Inputs/StyledButton";

/**
 * The {@link StyledButton} element with "OK" text and with primary and outlined styling.
 *
 * @name AcceptButton
 * @class
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props - Any other props will be forwarded to the {@link StyledButton} element.
 * @param {React.ReactNode} [props.children = "Ok"] - The content of the button.
 * @param {function} props.onClick - Callback fired when the button was clicked on.
 * @returns {React.ReactElement}
 */
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
