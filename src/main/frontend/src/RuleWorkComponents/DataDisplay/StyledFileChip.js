import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.chip.text,
        backgroundColor: theme.palette.chip.background,
    },
    clickable: {
        '&:hover': {
            color: theme.palette.chip.text,
            backgroundColor: theme.palette.chip.background,
        }
    },
    deletable: {
        '&:focus': {
            color: theme.palette.chip.text,
            backgroundColor: theme.palette.chip.background,
        }
    }
}));


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