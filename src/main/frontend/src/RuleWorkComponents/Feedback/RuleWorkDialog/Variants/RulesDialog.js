import React, {Component} from "react";
import PropTypes from "prop-types";
import RuleWorkDialog from "../RuleWorkDialog";
import VirtualizedTraits from "../Elements/VirtualizedTraits";
import VirtualizedTableItems from "../Elements/VirtualizedTableItems";
import VirtualizedItem from "../Elements/VirtualizedItem";

class RulesDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemInTableIndex: undefined
        };
    }

    onExited = () => {
        this.setState({
            itemInTableIndex: undefined
        });
    };

    onItemInTableSelected = (index) => {
        this.setState({
            itemInTableIndex: index
        });
    };

    render() {
        const { itemInTableIndex } = this.state;
        const { item, projectResult, ...other } = this.props;

        return (
            <RuleWorkDialog onExited={this.onExited} title={"Selected rule: " + item.name} {...other}>
                <div id={"rules-traits"}>
                    <VirtualizedTraits traits={item.traits}/>
                </div>
                <div id={"rules-table-content"} style={{display: "flex", flexDirection: "column", width: "20%"}}>
                    <VirtualizedTableItems
                        headerText={"Indices of covered objects"}
                        itemInTableIndex={itemInTableIndex}
                        onItemInTableSelected={this.onItemInTableSelected}
                        table={item.tables.indicesOfCoveredObjects}
                    />
                </div>
                <div id={"rules-table-item"} style={{width: "40%"}}>
                    {!Number.isNaN(Number(itemInTableIndex)) &&
                        <VirtualizedItem
                            informationTable={projectResult.informationTable}
                            itemInTableIndex={itemInTableIndex}
                        />
                    }
                </div>
            </RuleWorkDialog>
        );
    }
}

RulesDialog.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        tables: PropTypes.object.isRequired,
        actions: PropTypes.object,
        traits: PropTypes.object.isRequired
    }),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    projectResult: PropTypes.object.isRequired,
};

export default RulesDialog;