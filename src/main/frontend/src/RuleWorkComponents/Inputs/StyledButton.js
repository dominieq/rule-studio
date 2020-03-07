import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    text: {
        color: props => ({
            "inherit": "inherit",
            "green": "#6BD425",
            "red": "#4C061D"
        }[props.styleVariant]),
    },
    contained: {
        color: "#2A3439",
        backgroundColor: "#ABFAA9",
        "&:hover": {
            color: "#2A3439",
            backgroundColor: "#6BD425",
        },
        "&:active": {
            color: "#2A3439",
            backgroundColor: "#6BD425",
        }
    },
    outlined: {
        color: props => ({
            "inherit": "inherit",
            "green": "#66FF66",
            "red": "#F2545B",
        }[props.styleVariant]),
        borderColor: props => ({
            "inherit": "inherit",
            "green": "#6BD425",
            "red": "#4C061D",
        }[props.styleVariant]),
    },
    icon: {
        minWidth: 0,
    },
}, {name: "styled-button"});

function StyledButton(props) {
    const {children, buttonVariant, styleVariant, ...other} = props;
    const classes = useStyles(props);

    return (
        <Button
            {...other}
            className={clsx(classes[buttonVariant])}
            {...styleVariant === "inherit" ? {color: styleVariant} : null}
            {...buttonVariant !== "icon" ? {variant: buttonVariant} : null}
        >
            {children}
        </Button>
    )
}

StyledButton.propTypes = {
    children: PropTypes.node,
    buttonVariant: PropTypes.oneOf(["text", "outlined", "contained", "icon"]),
    styleVariant: PropTypes.oneOf(["inherit", "green", "red"]),
};

StyledButton.defaultProps = {
    buttonVariant: "text",
    styleVariant: "inherit"
};

export default StyledButton;