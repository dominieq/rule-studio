import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import StyledCircularProgress from "./StyledCircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    root: {
        borderRadius: 4,
        '& .MuiSnackbarContent-root': {
            backgroundColor: theme.palette.background.main1,
            color: theme.palette.text.main1,
            minWidth: 190
        }
    }
}), {name: "LoadingSnackbar"});

function LoadingSnackbar(props) {
    const classes = useStyles();

    return (
        <Snackbar
            action={<StyledCircularProgress size={24} />}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
            classes={{root: classes.root}}
            open={props.open}
            message={<Typography>{props.message}</Typography>}
        />
    )
}

LoadingSnackbar.propTypes = {
    message: PropTypes.string,
    open: PropTypes.bool.isRequired,
};

export default LoadingSnackbar;