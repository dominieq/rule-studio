import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import StyledButton from "../../../../Utils/Inputs/StyledButton";
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
            <StyledButton
                aria-label={"swap matrix"}
                className={classes.root}
                isIcon={true}
                onClick={props.onSwap}
                themeVariant={"secondary"}
                {...ButtonProps}
            >
                <SwapVert />
            </StyledButton>
        </CustomTooltip>
    )
}

MatrixSwapButton.propTypes = {
    ButtonProps: PropTypes.object,
    onSwap: PropTypes.func,
    tooltip: PropTypes.string.isRequired,
    TooltipProps: PropTypes.object
};

export default MatrixSwapButton;