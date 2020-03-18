import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const useStylesSwitch = makeStyles(theme => ({
    root: {
        width: 34,
        height: 20,
        padding: "0 0 2px",
        margin: "8px 8px 8px 0",
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            '& + $track': {
                backgroundColor: '#6BD425',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 17,
        height: 17,
        color: '#ABFAA9',
    },
    track: {
        borderRadius: 20 / 2,
        border: "1px solid #2A3439",
        backgroundColor: "#545F66",
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}), {name: "MuiSwitch"});

export function StyledSwitch(props) {
    const {classes: propsClasses, ...other} = props;
    const classes = {...useStylesSwitch(), ...propsClasses};

    return (
        <Switch
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            focusVisibleClassName={classes.focusVisible}
            {...other}
        />
    )
}

StyledSwitch.propTypes = {
    checked: PropTypes.bool,
    classes: PropTypes.object,
    className: PropTypes.string,
    disableRipple: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
};

StyledSwitch.defaultProps = {
    disableRipple: true,
};

const useStylesLabel = makeStyles({
    root: {
        position: "relative",
        margin: 0,
        display: "flex",
    },
});

export function RuleWorkSwitch(props) {
    const {classes: propsClasses, label, ...other} = props;
    const classes = {...useStylesLabel(), ...propsClasses};

    return (
        <FormControlLabel
            classes={classes}
            control={<StyledSwitch {...other} />}
            label={label}
        />
    )
}

RuleWorkSwitch.propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};