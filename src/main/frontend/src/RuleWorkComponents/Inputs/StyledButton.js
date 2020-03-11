import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
    text: {
        color: props => ({
            "inherit": "inherit",
            "primary": "#ABFAA9",
            "secondary": "#E8D963"
        }[props.themeVariant]),
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
            "primary": "#ABFAA9",
            "secondary": "#E8D963",
        }[props.themeVariant]),
        borderColor: props => ({
            "inherit": "inherit",
            "primary": "#ABFAA9",
            "secondary": "#E8D963",
        }[props.themeVariant]),
    },
    icon: {
        padding: 6,
        color: props => ({
            "inherit": "inherit",
            "primary": "#ABFAA9",
            "secondary": "#E8D963"
        })[props.themeVariant]
    },
}, {name: "styled-button"});

function StyledButton(props) {
    const {children, isIcon, themeVariant, variant, ...other} = props;
    const classes = useStyles(props);

    return (
        <Fragment>
            {isIcon ?
               <IconButton
                   className={classes.icon}
                   {...other}
               >
                   {children}
               </IconButton>
                :
                <Button
                    className={classes[variant]}
                    variant={variant}
                    {...other}
                >
                    {children}
                </Button>
            }
        </Fragment>
    )
}

StyledButton.propTypes = {
    children: PropTypes.node,
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