import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const useStylesSwitch = makeStyles(theme => ({
    root: {
        width: 36,
        height: 20,
        padding: 0,
        margin: theme.spacing(1),
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
        width: 18,
        height: 18,
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
}));

function StyledSwitchElement(props) {
    const {...other} = props;
    const classes = useStylesSwitch();

    return (
        <Switch
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            disableRipple={true}
            focusVisibleClassName={classes.focusVisible}
            {...other}
        />
    )
}

StyledSwitchElement.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};

const useStylesLabel = makeStyles({
    root: {
        position: "relative",
        left: -36,
        margin: "5px 0 0",
    }
});

function StyledSwitch(props) {
    const {label, ...other} = props;
    const classes = useStylesLabel();

    return (
        <FormControlLabel
            classes={{root: classes.root}}
            control={<StyledSwitchElement {...other} />}
            label={label}
        />
    )
}

StyledSwitch.propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};

export default StyledSwitch;