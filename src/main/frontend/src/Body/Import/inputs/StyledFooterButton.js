import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    root: {
        color: props => props.type === "accept" ?
            "#66FF66" :
            "#F2545B",
    },
    outlined: {
        borderColor: props => props.type === "accept" ?
            "#6BD425" :
            "#4C061D",
    },
});

function StyledFooterButton(props) {
    const {children, type, ...other} = props;
    const classes = useStyles(props);

    return (
        <Button
            {...other}
            classes={{
                root: classes.root,
                outlined: classes.outlined,
            }}
        >
            {children}
        </Button>

    )
}

StyledFooterButton.propTypes = {
    children: PropTypes.any,
    type: PropTypes.oneOf(["accept", "cancel"])
};

export default StyledFooterButton;