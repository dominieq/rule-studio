import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles({
    root: {
        color: "#2A3439",
        backgroundColor: "#6BD425",
    },
    clickable: {
        '&:hover': {
            color: "#2A3439",
            backgroundColor: "#6BD425",
        }
    },
    deletable: {
        '&:focus': {
            color: "#2A3439",
            backgroundColor: "#6BD425",
        }
    }
});


function StyledFileChip(props) {
    const {...other} = props;
    const classes = useStyles();

    return (
        <Chip
            {...other}
            classes={{
                root: classes.root,
                clickable: classes.clickable,
                deletable: classes.deletable,
            }}
        />
    );
}

export default StyledFileChip;