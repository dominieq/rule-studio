import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
    tooltip: {
        backgroundColor: theme.palette.paper.text,
        color: theme.palette.background.default,
    }
}));

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
    const {children, isCustom, themeVariant, ...other} = props;
    const classes = useStyles(props);

    return (
        <Tooltip classes={{tooltip: classes.tooltip}} {...other}>
            {isCustom ?
                <DefaultForwardRef>
                    {children}
                </DefaultForwardRef>
                :
                {children}
            }
        </Tooltip>
    )
}

RuleWorkTooltip.propTypes = {
    children: PropTypes.node,
    isCustom: PropTypes.bool,
    themeVariant: PropTypes.oneOf(["default", "primary", "secondary"]),
    title: PropTypes.string.isRequired,
};

RuleWorkTooltip.defaultProps = {
    isCustom: true,
    themeVariant: "default",
};

export default RuleWorkTooltip;