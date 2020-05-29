import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CustomTooltip from "../../../Utils/DataDisplay/CustomTooltip";
import { StyledButton } from "../../../Utils/Inputs/StyledButton";
import Typography from "@material-ui/core/Typography";
import styles from "../styles/NavigateButton.module.css";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.main1,
    },
    tooltipWrapper: {
        marginLeft: 4
    },
    buttonRoot: {
        minWidth: "auto",
        padding: 0
    },
    buttonText: {
        color: theme.palette.text.main1,
        textTransform: "none",
        ...theme.typography.body1
    }
}), {name: "NavigateButton"});

function NavigateButton(props) {
    const { buttonText, introText, tooltipText, ...other } = props;

    const classes = useStyles();

    return (
        <div className={clsx(styles.Root, classes.root)}>
            <Typography component={"p"}>
                {introText}
            </Typography>
            <CustomTooltip
                arrow={true}
                classes={{wrapper: classes.tooltipWrapper}}
                enterDelay={500}
                enterNextDelay={500}
                title={tooltipText}
            >
                <StyledButton
                    className={clsx(classes.buttonRoot, classes.buttonText)}
                    color={"primary"}
                    {...other}
                >
                    {buttonText}
                </StyledButton>
            </CustomTooltip>
        </div>
    );
}

NavigateButton.propTypes = {
    "aria-label": PropTypes.string,
    buttonText: PropTypes.string,
    onClick: PropTypes.func,
    introText: PropTypes.node,
    tooltipText: PropTypes.node
};

export default NavigateButton;
