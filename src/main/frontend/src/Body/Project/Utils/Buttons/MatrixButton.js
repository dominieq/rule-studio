import React from "react";
import PropTypes from "prop-types";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import { StyledIconButton } from "../../../../Utils/Inputs/StyledButton";
import Matrix from "mdi-material-ui/Matrix";

/**
 * The {@link StyledIconButton} with matrix icon wrapped around in {@link CustomTooltip}.
 *
 * @name Matrix Button
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props
 * @param {Object} props.ButtonProps - Props applied to the {@link StyledIconButton} element.
 * @param {function} props.onClick - Callback fired when the button was clicked on.
 * @param {string} props.title - The title of the {@link CustomTooltip} element.
 * @param {Object} props.TooltipProps - Props applied to the {@link CustomTooltip} element.
 * @returns {React.ReactElement}
 */
function MatrixButton(props) {
    const {title, ...other} = props;
    
    return (
        <CustomTooltip id={"matrix-button-tooltip"} title={title}>
            <StyledIconButton
                aria-label={"matrix-button"}
                color={"secondary"}
                {...other}
            >
                <Matrix />
            </StyledIconButton>
        </CustomTooltip>
    )

}

MatrixButton.propTypes = {
    ButtonProps: PropTypes.object,
    onClick: PropTypes.func,
    title: PropTypes.string.isRequired,
    TooltipProps: PropTypes.object
};

export default MatrixButton;