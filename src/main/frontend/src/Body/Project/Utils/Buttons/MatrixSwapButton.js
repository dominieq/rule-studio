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