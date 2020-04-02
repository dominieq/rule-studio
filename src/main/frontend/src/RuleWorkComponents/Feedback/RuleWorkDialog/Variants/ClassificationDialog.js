import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import RuleWorkDialog from "../RuleWorkDialog";
import VirtualizedItem from "../Elements/VirtualizedItem";
import VirtualizedTableItems from "../Elements/VirtualizedTableItems";
import VirtualizedTraits from "../Elements/VirtualizedTraits";

class ClassificationDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            itemInTableIndex: undefined
        };
    }

    onEnter = () => {
        this.setState({
            itemInTableIndex: undefined
        });
    };

    onItemInTableSelected = (index) => {
        console.log(index);
        this.setState({
            itemInTableIndex: index
        });
    };

    render() {
        const { itemInTableIndex } = this.state;
        const { item, ruleSet, ...other } = this.props;

        return (
            <RuleWorkDialog onEnter={this.onEnter} title={"Selected item: " + item.name} {...other}>
                <div id={"classification-object"} style={{width: "40%"}}>
                    <VirtualizedItem
                        index={item.id}
                        informationTable={item.traits}
                    />
                </div>
                <div id={"classification-rules"} style={{display: "flex", flexDirection: "column", width: "15%"}}>
                    <VirtualizedTableItems
                        headerText={"Indices of covering rules"}
                        index={itemInTableIndex}
                        itemText={"Rule"}
                        onItemInTableSelected={this.onItemInTableSelected}
                        table={item.tables.indicesOfCoveringRules}
                    />
                </div>
                <div id={"classification-rules-traits"} style={{width: "40%"}}>
                    {!Number.isNaN(Number(itemInTableIndex)) &&
                        <VirtualizedTraits
                            traits={ruleSet[itemInTableIndex].ruleCharacteristics}
                        />
                    }
                </div>
            </RuleWorkDialog>
        );
    }
}

ClassificationDialog.propTypes = {
    item: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.string,
        traits: PropTypes.object,
        actions: PropTypes.object,
        tables: PropTypes.object
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    ruleSet: PropTypes.arrayOf(PropTypes.object),
};

export default ClassificationDialog;
