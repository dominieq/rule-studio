import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
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
 * <h3>Overview</h3>
 * The Slider component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/slider/" target="_blank">Slider</a>.
 * <br>
 * Style was taken from this
 * <a href="https://material-ui.com/components/slider/#customized-sliders" target="_blank">tutorial</a>
 * with some changes.
 *
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props - Any other props will be forwarded to the Slider component.
 * @returns {React.ReactElement}
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

StyledSlider.propTypes = {
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-valuetext': PropTypes.string,
    classes: PropTypes.object,
    color: PropTypes.oneOf(['primary', 'secondary']),
    component: PropTypes.elementType,
    defaultValue: PropTypes.oneOfType([ PropTypes.number, PropTypes.arrayOf(PropTypes.number) ]),
    disabled: PropTypes.bool,
    getAriaLabel: PropTypes.func,
    getAriaValueText: PropTypes.func,
    marks: PropTypes.oneOfType([ PropTypes.bool, PropTypes.array ]),
    max: PropTypes.number,
    min: PropTypes.number,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onChangeCommitted: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    scale: PropTypes.func,
    step: PropTypes.number,
    style: PropTypes.object,
    ThumbComponent: PropTypes.elementType,
    track: PropTypes.oneOf(["normal", false, "inverted"]),
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.arrayOf(PropTypes.number) ]),
    ValueLabelComponent: PropTypes.elementType,
    valueLabelDisplay: PropTypes.oneOf(['on', 'auto', 'off']),
    valueLabelFormat: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ])
}

export default StyledSlider;
