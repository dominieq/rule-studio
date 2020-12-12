import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CustomTooltip from "../DataDisplay/CustomTooltip";
import StyledIconButton from "./StyledButton/StyledIconButton";
import { ButtonWithTooltipPropTypes, StyledIconButtonPropTypes } from "./StyledButton/propTypes";
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
 * <h3>Overview</h3>
 * The {@link StyledIconButton} with swap-vert icon wrapped around in {@link CustomTooltip}.
 *
 * @constructor
 * @category Buttons
 * @param {Object} props - Any other props will be forwarded to {@link StyledIconButton} element.
 * @param {string} props.tooltip - The title of the {@link CustomTooltip} element.
 * @param {string} props.tooltipId - The id of the {@link CustomTooltip} element.
 * @param {Object} props.TooltipProps - Props applied to the {@link CustomTooltip} element.
 * @returns {React.ReactElement}
 */
function MatrixSwapButton(props) {
    const { tooltip, tooltipId, TooltipProps, ...other } = props;
    const classes = useStyles()

    return (
        <CustomTooltip id={tooltipId} title={tooltip} {...TooltipProps}>
            <StyledIconButton aria-label={"swap-matrix"} className={classes.root} color={"secondary"} {...other}>
                <SwapVert />
            </StyledIconButton>
        </CustomTooltip>
    )
}

MatrixSwapButton.propTypes = {
    ...StyledIconButtonPropTypes,
    ...ButtonWithTooltipPropTypes
};

export default MatrixSwapButton;
