import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import { StyledIconButton } from "../../../../Utils/Inputs/StyledButton";
import SwapVert from "@material-ui/icons/SwapVert";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        border: "1px solid",
        '&:hover': {
            backgroundColor: theme.palette.background.defaultDark
        }
    }
}), {name: "SwapMatrix"});

/**
 * The {@link StyledIconButton} with swap-vert icon wrapped around in {@link CustomTooltip}.
 *
 * @name Matrix Swap Button
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props
 * @param {Object} props.ButtonProps - Props applied to the {@link StyledIconButton} element.
 * @param {function} props.onSwap - Callback fired when the button was clicked on.
 * @param {string} props.title - The title of the {@link CustomTooltip} element.
 * @param {Object} props.TooltipProps - Props applied to the {@link CustomTooltip} element.
 * @returns {React.ReactElement}
 */
function MatrixSwapButton(props) {
    const { ButtonProps, tooltip, TooltipProps } = props;
    const classes = useStyles()

    return (
        <CustomTooltip title={tooltip} {...TooltipProps}>
            <StyledIconButton
                aria-label={"swap matrix"}
                className={classes.root}
                color={"secondary"}
                onClick={props.onSwap}
                {...ButtonProps}
            >
                <SwapVert />
            </StyledIconButton>
        </CustomTooltip>
    )
}

MatrixSwapButton.propTypes = {
    ButtonProps: PropTypes.object,
    onSwap: PropTypes.func,
    tooltip: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object
};

export default MatrixSwapButton;