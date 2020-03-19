import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
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

function UpdateAlert(props) {
    const {children} = props;

    return (
        <StyledBadge
            badgeContent={
                <RuleWorkTooltip title={"Data has changed! Recalculate to see changes"}>
                    <AlertOctagram />
                </RuleWorkTooltip>
            }
            overlap={"circle"}
        >
            {children}
        </StyledBadge>
    )
}

UpdateAlert.propTypes = {
    children: PropTypes.node,
};

export default UpdateAlert;