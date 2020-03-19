import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
    tooltip: {
        backgroundColor: theme.palette.paper.text,
        border: "1px solid",
        borderColor: theme.palette.background.default,
        color: theme.palette.background.default,
    },
    wrapper: {

    }
}), {name: "MuiTooltip"});

function DefaultElement(props, ref) {
    const {children, isDisabled, ...other} = props;

    return (
        <div ref={ref} {...other}>
            {children}
        </div>
    )
}

const DefaultForwardRef = React.forwardRef(DefaultElement);

function RuleWorkTooltip(props) {
    const {children, classes: propsClasses, isCustom, ...other} = props;
    const classes = {...useStyles(), ...propsClasses};

    return (
        <Tooltip classes={{tooltip: classes.tooltip}} {...other}>
            {isCustom ?
                <DefaultForwardRef className={classes.wrapper}>
                    {children}
                </DefaultForwardRef>
                :
                {children}
            }
        </Tooltip>
    )
}

RuleWorkTooltip.propTypes = {
    arrow: PropTypes.bool,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    enterDelay: PropTypes.number,
    id: PropTypes.string,
    isCustom: PropTypes.bool,
    leaveDelay: PropTypes.number,
    title: PropTypes.string.isRequired,
};

RuleWorkTooltip.defaultProps = {
    isCustom: true,
};

export default RuleWorkTooltip;