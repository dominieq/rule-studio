import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StyledExpansionPanel from "../../../../RuleWorkComponents/Surfaces/StyledExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Union from "../api/Union";

class UnionListItem extends Component {
    render() {
        const {children, union} = this.props;

        return (
            <StyledExpansionPanel TransitionProps={{unmountOnExit: true}}>
                <ExpansionPanelSummary
                    id={union.id + "-header"}
                    aria-controls={union.id + "-content"}
                    expandIcon={<ExpandMoreIcon color={"inherit"}/>}
                >
                    <Typography variant={"button"} component={"div"}>
                        {union.name}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {children}
                </ExpansionPanelDetails>
            </StyledExpansionPanel>
        )
    }
}

UnionListItem.propTypes = {
    children: PropTypes.node.isRequired,
    union: PropTypes.instanceOf(Union).isRequired,
};

export default UnionListItem;

