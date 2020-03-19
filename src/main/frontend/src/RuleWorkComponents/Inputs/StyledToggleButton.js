import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.default,
        fontSize: "0.775rem",
        height: 36,
        '&:hover': {
            backgroundColor: theme.palette.button.contained.backgroundAction,
            color: theme.palette.button.contained.text,
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.button.contained.background,
            color: theme.palette.button.contained.text,
            '&:hover': {
                backgroundColor: theme.palette.button.contained.backgroundAction,
                color: theme.palette.button.contained.text,
            }
        }
    },
}), {name: "MuiToggleButton"});

function StyledToggleButton(props) {
    const {children, ...other} = props;
    const classes = useStyles();

    return (
        <ToggleButton classes={{root: classes.root}} {...other}>
            {children}
        </ToggleButton>
    )
}

StyledToggleButton.propTypes = {
    children: PropTypes.node,
    value: PropTypes.any,
};

export default StyledToggleButton;