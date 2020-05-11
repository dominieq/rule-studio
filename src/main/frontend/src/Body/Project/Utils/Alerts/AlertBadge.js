import React from "react";
import PropTypes from "prop-types";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import Badge from "@material-ui/core/Badge";

const StyledBadge = withStyles(theme => ({
    badge: {
        color: theme.palette.error.main,
        top: "2.5%",
        right: 0,
        '& .MuiSvgIcon-root': {
            height: "0.75em",
            width: "0.75em"
        }
    }
}), {name: "AlertBadge"})(props => <Badge {...props} />);

const useStyles = makeStyles({
    maxWidth: {
        maxWidth: "20.5em",
    },
}, {name: "BadgeTooltip"});

function AlertBadge(props) {
    const { classes: propsClasses, TooltipProps } = props;
    const classes = {...useStyles(), ...propsClasses};

    return (
        <StyledBadge
            badgeContent={
                <CustomTooltip
                    classes={{tooltip: classes.maxWidth}}
                    leaveDelay={1000}
                    title={props.title}
                    {...TooltipProps}
                >
                    {props.icon}
                </CustomTooltip>
            }
            overlap={"circle"}
        >
            {props.children}
        </StyledBadge>
    )
}

AlertBadge.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    icon: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object
};

export default AlertBadge;