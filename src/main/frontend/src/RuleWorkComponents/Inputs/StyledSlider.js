import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
    root: {
        color: "#66FF66",
        height: 6
    },
    thumb: {
        height: 18,
        width: 18,
        backgroundColor: "#ABFAA9",
        marginTop: -6,
        marginLeft: -8,
        '&:hover':{
            backgroundColor: "#6BD425",
            boxShadow: "none",
        },
        '&:active': {
            backgroundColor: "#6BD425",
            border: "2px solid #66FF66",
            boxShadow: "none",
        },
    },
    track: {
        height: 6,
        borderRadius: 3,
    },
    rail: {
        height: 6,
        borderRadius: 3,
        backgroundColor: "#2A3439",
    },
}, {name: "MuiSlider"});

function StyledSlider(props) {
    const {...other} = props;
    const classes = useStyles();

    return (
        <Slider
            {...other}
            classes={{
                root: classes.root,
                thumb: classes.thumb,
                track: classes.track,
                rail: classes.rail,
            }}
        />
    )
}

export default StyledSlider;