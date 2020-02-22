import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Union from "./api/Union";

class UnionListItem extends Component {
    render() {
        const {children, union} = this.props;

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary
                    id={union.id + "-header"}
                    aria-controls={union.id + "-content"}
                    expandIcon={<ExpandMoreIcon/>}
                >
                    <Typography variant={"button"} component={"div"}>
                        {union.name}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {children}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

UnionListItem.propTypes = {
    children: PropTypes.any.isRequired,
    union: PropTypes.instanceOf(Union).isRequired,
};

export default UnionListItem;

