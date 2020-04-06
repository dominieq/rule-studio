import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import RuleWorkDialog from "../RuleWorkDialog";
import ObjectTable from "../Elements/ObjectTable";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";

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
                    <ObjectTable
                        informationTable={item.traits}
                        objectIndex={item.id}
                        objectHeader={item.name}
                    />
                </div>
                <div id={"classification-rules"} style={{display: "flex", flexDirection: "column", width: "15%"}}>
                    <TableItemsList
                        headerText={"Indices of covering rules"}
                        itemIndex={itemInTableIndex}
                        itemText={"Rule"}
                        onItemInTableSelected={this.onItemInTableSelected}
                        table={item.tables.indicesOfCoveringRules}
                    />
                </div>
                <div id={"classification-rules-traits"} style={{width: "40%"}}>
                    {!Number.isNaN(Number(itemInTableIndex)) &&
                        <TraitsTable
                            traits={ruleSet[itemInTableIndex].ruleCharacteristics}
                        />
                    }
                </div>
            </RuleWorkDialog>
        );
    }
}

ClassificationDialog.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        traits: PropTypes.shape({
            attributes: PropTypes.arrayOf(PropTypes.object),
            objects: PropTypes.arrayOf(PropTypes.object)
        }).isRequired,
        tables: PropTypes.shape({
            indicesOfCoveringRules: PropTypes.arrayOf(PropTypes.number)
        }).isRequired
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    ruleSet: PropTypes.arrayOf(PropTypes.object),
};

export default ClassificationDialog;
