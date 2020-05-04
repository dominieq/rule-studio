import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import StyledButton from "../../../../Utils/Inputs/StyledButton";
import GetApp from "@material-ui/icons/GetApp";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        border: "1px solid",
        '&:hover': {
            backgroundColor: theme.palette.background.defaultDark
        }
    }
}), {name: "DownloadMatrix"})

function MatrixDownloadButton(props) {
    const { ButtonProps, tooltip, TooltipProps } = props;
    const classes = useStyles();

    return (
        <CustomTooltip title={tooltip} {...TooltipProps}>
            <StyledButton
                aria-label={"download matrix"}
                className={classes.root}
                isIcon={true}
                onClick={props.onSave}
                themeVariant={"primary"}
                {...ButtonProps}
            >
                <GetApp />
            </StyledButton>
        </CustomTooltip>
    )
}

MatrixDownloadButton.propTypes = {
    ButtonProps: PropTypes.object,
    onSave: PropTypes.func,
    tooltip: PropTypes.string.isRequired,
    TooltipProps: PropTypes.object
};

export default MatrixDownloadButton;