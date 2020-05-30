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
        textDecoration: "underline",
        textTransform: "none",
        ...theme.typography.body1
    }
}), {name: "NavigateButton"});

/**
 * An element that consists of a paragraph and a button wrapped in a tooltip.
 * The purpose of this element is to display a sentence where the navigate button is a part of it
 * and is navigating to something that was mentioned in the sentence.
 * @param {object} props Any other props supplied will be provided to StyledButton element.
 * @param {string} props.buttonText A text that is going to be displayed inside of a button.
 * @param {React.ReactNode} props.introText A text that is going to be displayed before a button.
 * @param {React.ReactNode} props.tooltipText A text that is going to be displayed in a tooltip.
 * @returns {React.ReactElement}
 * @constructor
 */
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
    /**
     * @ignore
     */
    "aria-label": PropTypes.string,
    /**
     * A text that is going to be displayed inside of a button.
     */
    buttonText: PropTypes.string,
    /**
     * @ignore
     */
    onClick: PropTypes.func,
    /**
     * A text that is going to be displayed before a button.
     */
    introText: PropTypes.node,
    /**
     * A text that is going to be displayed in a tooltip.
     */
    tooltipText: PropTypes.node
};

export default NavigateButton;
