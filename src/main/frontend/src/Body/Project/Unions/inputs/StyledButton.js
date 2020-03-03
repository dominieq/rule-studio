import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
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
    }
}, {name: "MuiButton"});

function StyledButton(props) {
    const {children, ...other} = props;
    const classes = useStyles();

    return (
        <Button {...other} classes={{contained: classes.contained}} >
            {children}
        </Button>
    )
}

StyledButton.propTypes = {
    children: PropTypes.any,
};

export default StyledButton;