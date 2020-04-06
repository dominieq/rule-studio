import React, {Component} from "react";
import PropTypes from "prop-types";
import RuleWorkDialog from "../RuleWorkDialog";
import TraitsTable from "../Elements/TraitsTable";
import TableItemsList from "../Elements/TableItemsList";
import ObjectTable from "../Elements/ObjectTable";

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
        const { item, items, projectResult, ...other } = this.props;

        return (
            <RuleWorkDialog onExited={this.onExited} title={"Selected rule: " + item.name} {...other}>
                <div id={"rules-traits"}>
                    <TraitsTable
                        traits={item.traits}
                    />
                </div>
                <div id={"rules-table-content"} style={{display: "flex", flexDirection: "column", width: "20%"}}>
                    <TableItemsList
                        headerText={"Indices of covered objects"}
                        itemIndex={itemInTableIndex}
                        onItemInTableSelected={this.onItemInTableSelected}
                        table={item.tables.indicesOfCoveredObjects}
                    />
                </div>
                <div id={"rules-table-item"} style={{width: "40%"}}>
                    {!Number.isNaN(Number(itemInTableIndex)) &&
                        <ObjectTable
                            informationTable={projectResult.informationTable}
                            objectIndex={itemInTableIndex}
                            objectHeader={items ? items[itemInTableIndex].name : undefined}
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
        traits: PropTypes.object.isRequired,
        tables: PropTypes.shape({
            indicesOfCoveredObjects: PropTypes.arrayOf(PropTypes.number)
        }).isRequired
    }),
    items: PropTypes.arrayOf(PropTypes.object),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    projectResult: PropTypes.object.isRequired,
};

export default RulesDialog;