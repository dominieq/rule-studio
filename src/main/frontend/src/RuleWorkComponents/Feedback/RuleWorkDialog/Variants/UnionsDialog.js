import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import RuleWorkDialog from "../RuleWorkDialog";
import TablesList from "../Elements/TablesList";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";
import ObjectTable from "../Elements/ObjectTable";

class UnionsDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tableIndex: undefined,
            itemInTableIndex: undefined,
        };
    }

    onExited = () => {
        this.setState({
            tableIndex: undefined,
            itemInTableIndex: undefined,
        })
    };

    onTableSelected = (index) => {
        this.setState({
            tableIndex: index,
            itemInTableIndex: undefined
        });
    };

    onItemInTableSelected = (index) => {
        this.setState({
            itemInTableIndex: index
        });
    };

    render() {
        const { tableIndex, itemInTableIndex } = this.state;
        const { item, items, projectResult, ...other}  = this.props;

        return (
            <RuleWorkDialog onExited={this.onExited} title={"Selected item: " + item.name} {...other}>
                <div id={"unions-tables"}>
                    <TablesList
                        headerText={"Union's characteristics"}
                        tableIndex={tableIndex}
                        onTableSelected={this.onTableSelected}
                        tables={item.tables}
                    />
                </div>
                <div id={"unions-table-content"} style={{display: "flex", flexDirection: "column"}}>
                    {!Number.isNaN(Number(tableIndex)) &&
                        <TableItemsList
                            headerText={Object.keys(item.tables)[tableIndex]}
                            itemIndex={itemInTableIndex}
                            onItemInTableSelected={this.onItemInTableSelected}
                            table={Object.values(item.tables)[tableIndex]}
                        />
                    }
                </div>
                <div id={"unions-table-item"} style={{display: "flex", flexDirection: "column"}}>
                    <div style={{minHeight: "30%"}}>
                        <TraitsTable
                            traits={item.traits}
                        />
                    </div>
                    <div style={{flexGrow: 1}}>
                        {!Number.isNaN(Number(itemInTableIndex)) &&
                            <ObjectTable
                                informationTable={projectResult.informationTable}
                                objectIndex={itemInTableIndex}
                                objectHeader={items ? items[itemInTableIndex].name : undefined}
                            />
                        }
                    </div>
                </div>
            </RuleWorkDialog>
        );
    }
}

UnionsDialog.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        traits: PropTypes.shape({
            'Accuracy of approximation': PropTypes.number,
            'Quality of approximation': PropTypes.number,
        }).isRequired,
        tables: PropTypes.shape({
            'Lower approximation': PropTypes.arrayOf(PropTypes.number),
            'Upper approximation': PropTypes.arrayOf(PropTypes.number),
            'Boundary': PropTypes.arrayOf(PropTypes.number),
            'Positive region': PropTypes.arrayOf(PropTypes.number),
            'Negative region': PropTypes.arrayOf(PropTypes.number),
            'Boundary region': PropTypes.arrayOf(PropTypes.number),
            'Objects': PropTypes.arrayOf(PropTypes.number)
        }).isRequired
    }),
    items: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func,
    open: PropTypes.bool,
    projectResult: PropTypes.object.isRequired,
};

export default UnionsDialog;