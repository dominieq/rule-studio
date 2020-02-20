import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Variant from "./api/Variant";
import {getDominanceTypes} from "./api/DominanceTypes";
import "./VariantListItem.css";

class VariantListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dominance: "",
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // We will update component when its dominance in state has changed.
        const stateDominanceChanged = nextState.dominance !== this.state.dominance;

        // However if there was no change and next dominance is set to 'All' update is pointless.
        if (nextProps.dominance === "" && !stateDominanceChanged) return false;

        // We are going to check if dominance in props has changed.
        let propsDominanceChanged = nextProps.dominance !== this.props.dominance;

        // But if next dominance in props is the same as in current state update is pointless.
        if (nextProps.dominance === this.state.dominance) propsDominanceChanged = false;

        return propsDominanceChanged || stateDominanceChanged;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // We will update dominance to props value only when it's changed.
        let propsDominanceChanged = this.props.dominance !== prevProps.dominance;

        // However if its value is the same as previous state then updating is pointless.
        if (this.props.dominance === prevState.dominance) propsDominanceChanged = false;

        if (propsDominanceChanged) {
            this.setState({
                dominance: this.props.dominance,
            })
        }
    }

    selectVariable = (index, relation) => {
        const comparison = {
            variantMain: this.props.variant.id,
            variantOptional: index,
            relation: relation,
        };
        this.props.setComparison(comparison);
    };

    deselectVariable = () => {
        this.props.setComparison("")
    };

    changeDominance = (event) => {
        this.setState({
            dominance: event.target.value,
        }, () => {
            this.props.cancelDominance();
        })
    };

    render() {
        const dominanceTypes = getDominanceTypes();
        const variant = this.props.variant;
        const dominance = this.state.dominance;

        return (
            <ExpansionPanel TransitionProps={{unmountOnExit: true}}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-label={"expand-variant-" + variant.id}
                    aria-controls={"variant-" + variant.id + "-content"}
                    id={"variant-" + variant.id + "-header"}
                >
                    <Typography component={"h1"}>
                        Variant {variant.id}
                    </Typography>
                    <FormControl
                        aria-label={"choose-dominance-variant-" + variant.id}
                        label={"choose-dominance-variant-" + variant.id}
                        onClick={event => event.stopPropagation()}
                        onFocus={event => event.stopPropagation()}
                        variant={"outlined"}
                        margin={"dense"}
                    >
                        <Select
                            id={"single-dominance-type-selector"}
                            value={this.state.dominance}
                            onChange={this.changeDominance}
                        >
                            <MenuItem value={""}><em>All</em></MenuItem>
                            {dominanceTypes.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <TreeView
                        defaultExpandIcon={<ChevronRightIcon/>}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                    >
                        <TreeItem
                            hidden={dominance !== "" && dominance !== dominanceTypes[0]}
                            nodeId={"positiveDCones"}
                            label={"Positive dominance cone:"}
                        >
                            {variant.positives.map((element) => (
                                <TreeItem
                                    key={element}
                                    nodeId={element.toString()}
                                    label={element}
                                    onClick={() => this.selectVariable(element, "positive")}
                                    onBlur={() => this.deselectVariable()}
                                />
                            ))}
                        </TreeItem>
                        <TreeItem
                            hidden={dominance !== "" && dominance !== dominanceTypes[1]}
                            nodeId={"negativeDCones"}
                            label={"Negative dominance cone:"}
                        >
                            {variant.negatives.map((element) => (
                                <TreeItem
                                    key={element}
                                    nodeId={element.toString()}
                                    label={element}
                                    onClick={() => this.selectVariable(element, "negative")}
                                    onBlur={() => this.deselectVariable()}
                                />
                            ))}
                        </TreeItem>
                        <TreeItem
                            hidden={dominance !== "" && dominance !== dominanceTypes[2]}
                            nodeId={"positiveInvDCones"}
                            label={"Positive inverted dominance cone:"}
                        >
                            {variant.postivesInv.map((element) => (
                                <TreeItem
                                    key={element}
                                    nodeId={element.toString()}
                                    label={element}
                                    onClick={() => this.selectVariable(element, "positiveInv")}
                                    onBlur={() => this.deselectVariable()}
                                />
                            ))}
                        </TreeItem>
                        <TreeItem
                            hidden={dominance !== "" && dominance !== dominanceTypes[3]}
                            nodeId={"negativeInvDCones"}
                            label={"Negative inverted dominance cone:"}
                        >
                            {variant.negativesInv.map((element) => (
                                <TreeItem
                                    key={element}
                                    nodeId={element.toString()}
                                    label={element}
                                    onClick={() => this.selectVariable(element, "negativeInv")}
                                    onBlur={() => this.deselectVariable()}
                                />
                            ))}
                        </TreeItem>
                    </TreeView>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

VariantListItem.propTypes = {
    variant: PropTypes.instanceOf(Variant).isRequired,
    dominance: PropTypes.string.isRequired,
    cancelDominance: PropTypes.func.isRequired,
    setComparison: PropTypes.func.isRequired,
};

export default VariantListItem;