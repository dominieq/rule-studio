import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";

const useStyles = makeStyles({
    root: {
        backgroundColor: "rgb(171,250,169, 0.5)",
        color: "rgb(84,95,102, 0.9)",
        fontSize: "0.775rem",
        height: 36,
        '&:hover': {
            backgroundColor: "#ABFAA9",
            color: "#2A3439",
        },
        '&.Mui-selected': {
            backgroundColor: "#6BD425",
            color: "#2A3439",
            '&:hover': {
                backgroundColor: "#6BD425",
                color: "#2A3439",
            }
        }
    },
}, {name: "MuiToggleButton"});

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