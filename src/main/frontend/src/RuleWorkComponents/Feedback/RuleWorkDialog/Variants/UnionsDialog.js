import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import RuleWorkDialog from "../RuleWorkDialog";
import Tables from "../Elements/Tables";
import VirtualizedTableItems from "../Elements/VirtualizedTableItems";
import VirtualizedTraits from "../Elements/VirtualizedTraits";
import VirtualizedItem from "../Elements/VirtualizedItem";

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
        const {tableIndex, itemInTableIndex} = this.state;
        const {item, projectResult, ...other} = this.props;

        return (
            <RuleWorkDialog onExited={this.onExited} title={"Selected item: " + item.name} {...other}>
                <div id={"unions-tables"}>
                    <Tables
                        headerText={"Tables"}
                        tableIndex={tableIndex}
                        onTableSelected={this.onTableSelected}
                        tables={item.tables}
                    />
                </div>
                <div id={"unions-table-content"} style={{display: "flex", flexDirection: "column"}}>
                    {!Number.isNaN(Number(tableIndex)) &&
                        <VirtualizedTableItems
                            headerText={Object.keys(item.tables)[tableIndex]}
                            itemInTableIndex={itemInTableIndex}
                            onItemInTableSelected={this.onItemInTableSelected}
                            table={Object.values(item.tables)[tableIndex]}
                        />
                    }
                </div>
                <div id={"unions-table-item"} style={{display: "flex", flexDirection: "column"}}>
                    <div style={{minHeight: "30%"}}>
                        <VirtualizedTraits traits={item.traits} />
                    </div>
                    <div style={{flexGrow: 1}}>
                        {!Number.isNaN(Number(itemInTableIndex)) &&
                            <VirtualizedItem
                                informationTable={projectResult.informationTable}
                                itemInTableIndex={itemInTableIndex}
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
        traits: PropTypes.object.isRequired,
        actions: PropTypes.object,
        tables: PropTypes.object.isRequired
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool,
    projectResult: PropTypes.object.isRequired,
};

export default UnionsDialog;