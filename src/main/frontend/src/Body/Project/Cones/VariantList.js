import React, {Component} from 'react';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import "./VariantList.css";

class VariantList extends Component {

    selectVariable = (index, relation) => {
        const comparison = {
            variantMain: this.props.variant.id,
            variantOptional: index,
            relation: relation,
        };
        this.props.setComparison(comparison);
    };

    render() {

        return (
            <ExpansionPanel TransitionProps={{unmountOnExit: true}}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={this.props.variant.id + "-content"}
                    id={this.props.variant.id + "-header"}
                >
                    <Typography>
                        {this.props.variant.id}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <TreeView
                        defaultExpandIcon={<ChevronRightIcon/>}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                    >
                        <TreeItem nodeId={"positiveDCones"} label={"positiveDCones"}>
                            {this.props.variant.positives.map((element) => (
                                <TreeItem
                                    key={element}
                                    nodeId={element.toString()}
                                    label={element}
                                    onClick={() => this.selectVariable(element, "positive")}
                                />
                            ))}
                        </TreeItem>
                        <TreeItem nodeId={"negativeDCones"} label={"negativeDCones"}>
                            {this.props.variant.negatives.map((element) => (
                                <TreeItem
                                    key={element}
                                    nodeId={element.toString()}
                                    label={element}
                                    onClick={() => this.selectVariable(element, "negative")}
                                />
                            ))}
                        </TreeItem>
                        <TreeItem nodeId={"positiveInvDCones"} label={"positiveInvDCones"}>
                            {this.props.variant.postivesInv.map((element) => (
                                <TreeItem
                                    key={element}
                                    nodeId={element.toString()}
                                    label={element}
                                    onClick={() => this.selectVariable(element, "positiveInv")}
                                />
                            ))}
                        </TreeItem>
                        <TreeItem nodeId={"negativeInvDCones"} label={"negativeInvDCones"}>
                            {this.props.variant.negativesInv.map((element) => (
                                <TreeItem
                                    key={element}
                                    nodeId={element.toString()}
                                    label={element}
                                    onClick={() => this.selectVariable(element, "negativeInv")}
                                />
                            ))}
                        </TreeItem>
                    </TreeView>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export default VariantList;