import React from "react";
import PropTypes from "prop-types";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import Badge from "@material-ui/core/Badge";

const StyledBadge = withStyles(theme => ({
    badge: {
        color: theme.palette.button.secondary,
        top: "2.5%",
        right: 0,
        '& .MuiSvgIcon-root': {
            height: "0.75em",
            width: "0.75em"
        },
    },
}), {name: "AlertBadge"})(props => <Badge {...props} />);

const useStyles = makeStyles({
    'update-width': {
        maxWidth: "20.5em",
    },
}, {name: "MuiTooltip"});

function AlertBadge(props) {
    const {classes: propsClasses} = props;
    const classes = {...useStyles(), ...propsClasses};

    return (
        <StyledBadge
            badgeContent={
                <CustomTooltip classes={{tooltip: classes['update-width']}} leaveDelay={1000} title={props.title}>
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
    icon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
};

export default AlertBadge;