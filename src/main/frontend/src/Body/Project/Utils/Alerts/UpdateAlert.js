import React from "react";
import PropTypes from "prop-types";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import RuleWorkTooltip from "../../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import Badge from "@material-ui/core/Badge";
import AlertOctagram from "mdi-material-ui/AlertOctagram";

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
}), {name: "MuiBadge"})(props => <Badge {...props} />);

const useStyles = makeStyles({
    'update-width': {
        maxWidth: "20.5em",
    },
}, {name: "MuiTooltip"});

function UpdateAlert(props) {
    const classes = useStyles();

    return (
        <StyledBadge
            badgeContent={
                <RuleWorkTooltip
                    classes={{tooltip: classes['update-width']}}
                    leaveDelay={1000}
                    title={"Results in this tab are based on old data. Recalculate to refresh results"}
                >
                    <AlertOctagram />
                </RuleWorkTooltip>
            }
            overlap={"circle"}
        >
            {props.children}
        </StyledBadge>
    )
}

UpdateAlert.propTypes = {
    children: PropTypes.node,
};

export default UpdateAlert;