import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.background.subDark,
        height: 6
    },
    thumb: {
        height: 18,
        width: 18,
        backgroundColor: theme.palette.background.sub,
        marginTop: -6,
        marginLeft: -8,
        '&:hover':{
            backgroundColor: theme.palette.background.subDark,
            boxShadow: "none"
        },
        '&:active': {
            backgroundColor: theme.palette.background.subDark,
            border: `2px solid ${theme.palette.text.default}`,
            boxShadow: "none"
        }
    },
    track: {
        height: 6,
        borderRadius: 3
    },
    rail: {
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.palette.background.default
    }
}), {name: "MuiSlider"});

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