import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
    root: {
        color: "#66FF66",
    },
    wrapper: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
});

function StyledCircularProgress(props) {
    const {useWrapper, ...other} = props;
    const classes = useStyles();

    return (
        <div className={clsx({[classes.wrapper]: useWrapper})}>
            <CircularProgress {...other} classes={{root: classes.root}} />
        </div>

    )
}

StyledCircularProgress.propTypes = {
    useWrapper: PropTypes.bool,
};

StyledCircularProgress.defaultProps = {
    useWrapper: true,
};

export default StyledCircularProgress;