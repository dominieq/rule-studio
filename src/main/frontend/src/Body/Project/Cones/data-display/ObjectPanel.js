import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ObjectPanelHeader from "./ObjectPanelHeader";
import ObjectPanelContent from "./ObjectPanelContent";
import "./ObjectPanel.css";

class ObjectPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dominance: "All",
        };
    }

    onDominanceChange = (event) => {
        const dominance = event.target.value.toString();
        this.setState({
            dominance: dominance,
        }, () => {
            this.props.onDominanceChange({
                dominance: dominance,
                where: "panel",
            });
        });
    };

    onItemChangeSelection = (tuple) => {
        if(tuple) {
            this.props.onItemClick({
                objectMain: this.props.object.id,
                objectOptional: tuple.optional,
                relation: tuple.relation,
            });
        } else {
            this.props.onItemBlur();
        }
    };

    onDominanceUpdate = (dominance) => {
        this.setState({
            dominance: dominance,
        });
    };

    render() {
        const object = this.props.object;
        const dominance = this.state.dominance;

        return (
            <ExpansionPanel TransitionProps={{unmountOnExit: true}}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label={"expand-panel-" + object.id}
                    aria-controls={"expansion-panel-" + object.id + "-content"}
                    id={"expansion-panel-" + object.id + "-header"}
                >
                    <ObjectPanelHeader
                        dominance={dominance}
                        index={object.id}
                        name={object.name}
                        onDominanceChange={this.onDominanceChange}
                    />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <ObjectPanelContent
                        dominance={dominance}
                        dominanceCones={[
                            object.positives,
                            object.negatives,
                            object.positivesInv,
                            object.negativesInv
                        ]}
                        onItemChangeSelection={tuple => this.onItemChangeSelection(tuple)}
                    />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

ObjectPanel.propTypes = {
    object: PropTypes.object.isRequired,
    onDominanceChange: PropTypes.func.isRequired,
    onItemClick: PropTypes.func.isRequired,
    onItemBlur: PropTypes.func.isRequired,
};

export default ObjectPanel;