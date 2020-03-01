import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: props => props.direction,
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    dividers: {
        borderTopColor: "#6BD425",
        borderBottomColor: "#6BD425",
    }
});

function StyledDialogContent(props) {
    const {children, direction,  ...other} = props;
    const classes = useStyles(props);

    return (
        <DialogContent {...other} classes={{root: classes.root, dividers: classes.dividers}}>
            {children}
        </DialogContent>
    )
}

StyledDialogContent.propTypes = {
    children: PropTypes.any,
    direction: PropTypes.string.isRequired,
};

export default StyledDialogContent;