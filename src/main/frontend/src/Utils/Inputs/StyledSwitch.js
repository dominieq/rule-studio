import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Switch from "@material-ui/core/Switch";

const switchStyles = makeStyles(theme => ({
    root: {
        height: 18,
        marginRight: 8,
        padding: 0,
        width: 34,
    },
    switchBase: {
        padding: 0,
        '&$checked': {
            transform: 'translateX(16px)',
            '& + $track': {
                backgroundColor: theme.palette.background.subDark,
                border: `1px solid ${theme.palette.background.subDark}`,
                opacity: 1
            },
        },
        '&$focusVisible $thumb': {
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 17,
        height: 17,
        color: theme.palette.background.sub,
    },
    track: {
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.background.default}`,
        borderRadius: 20 / 2,
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}), {name: "MuiSwitch"});

/**
 * <h3>Overview</h3>
 * The Switch component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/switch/" target="_blank">Switch</a>.
 * <br>
 * Style was taken from this
 * <a href="https://material-ui.com/components/switches/#customized-switches" target="_blank">tutorial</a>
 * with some changes.
 *
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props - Any other props will be forwarded to the Switch component.
 * @returns {React.ReactElement}
 */
export function StyledSwitch(props) {
    const {classes: propsClasses, ...other} = props;
    let classes = switchStyles();

    if (propsClasses) classes = mergeClasses(classes, propsClasses);

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

export default StyledSwitch;
