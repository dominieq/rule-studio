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

/**
 * The Slider component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/slider/" target="_blank">Slider</a>.
 * <br>
 * Style was taken from this
 * <a href="https://material-ui.com/components/slider/#customized-sliders" target="_blank">tutorial</a>
 * with some changes.
 *
 * @name Styled Slider
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param props {Object} - Any other props will be forwarded to the Slider component.
 * @returns {React.ReactElement} - The Slider component from Material-UI library.
 */
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