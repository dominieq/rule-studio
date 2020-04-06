import React, {Fragment} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

const buttonStyles = makeStyles(theme => ({
    text: {
        color: props => ({
            "inherit": "inherit",
            "primary": theme.palette.button.primary,
            "secondary": theme.palette.button.secondary
        }[props.themeVariant]),
    },
    contained: {
        color: theme.palette.button.contained.text,
        backgroundColor: theme.palette.button.contained.background,
        "&:hover": {
            color: theme.palette.button.contained.text,
            backgroundColor: theme.palette.button.contained.backgroundAction,
        },
        "&:active": {
            color: theme.palette.button.contained.text,
            backgroundColor: theme.palette.button.contained.backgroundAction,
        }
    },
    outlined: {
        color: props => ({
            "inherit": "inherit",
            "primary": theme.palette.button.primary,
            "secondary": theme.palette.button.secondary,
        }[props.themeVariant]),
        borderColor: props => ({
            "inherit": "inherit",
            "primary": theme.palette.button.primary,
            "secondary": theme.palette.button.secondary,
        }[props.themeVariant]),
    },
    icon: {
        padding: 6,
        color: props => ({
            "inherit": "inherit",
            "primary": theme.palette.button.primary,
            "secondary": theme.palette.button.secondary
        })[props.themeVariant]
    },
}), {name: "styled-button"});

function StyledButton(props) {
    const { className, isIcon, themeVariant, variant, ...other } = props;
    const buttonClasses = buttonStyles({themeVariant: themeVariant});

    return (
        <Fragment>
            {isIcon ?
               <IconButton
                   className={clsx(buttonClasses.icon, className)}
                   {...other}
               />
                :
                <Button
                    className={clsx(buttonClasses[variant], className)}
                    variant={variant}
                    {...other}
                />
            }
        </Fragment>
    )
}

StyledButton.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    isIcon: PropTypes.bool,
    themeVariant: PropTypes.oneOf(["inherit", "primary", "secondary"]),
    variant: PropTypes.oneOf(["text", "outlined", "contained"]),
};

StyledButton.defaultProps = {
    isIcon: false,
    themeVariant: "inherit",
    variant: "text",
};

export default StyledButton;