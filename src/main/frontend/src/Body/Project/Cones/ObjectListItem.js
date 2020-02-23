import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./ObjectListItem.css";

class ObjectListItem extends PureComponent {

    render() {
        const {children, name} = this.props;
        const childrenArray = React.Children.toArray(children);
        const header = childrenArray.slice(0, 1);
        const content = childrenArray.slice(1);

        return (
            <ExpansionPanel TransitionProps={{unmountOnExit: true}}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label={"expand-variant-" + name}
                    aria-controls={"object-" + name + "-content"}
                    id={"object-" + name + "-header"}
                >
                    {header}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {content}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

ObjectListItem.propTypes = {
    children: PropTypes.array.isRequired,
    name: PropTypes.any.isRequired,
};

export default ObjectListItem;