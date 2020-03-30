import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import RuleWorkDialog from "../RuleWorkDialog";
import Tables from "../Elements/Tables";
import VirtualizedComparison from "../Elements/VirtualizedComparison";
import VirtualizedTableItems from "../Elements/VirtualizedTableItems";

class ConesDialog extends PureComponent {
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
            itemInTableIndex: undefined
        });
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
        const { item, projectResult, ...other } = this.props;

        return (
            <RuleWorkDialog onExited={this.onExited} title={"Selected item: " + item.name} {...other}>
                <div id={"cones-tables"}>
                    <Tables
                        headerText={"Dominance cones"}
                        onTableSelected={this.onTableSelected}
                        tableIndex={tableIndex}
                        tables={item.tables}
                    />
                </div>
                <div id={"cones-table-content"} style={{display: "flex", flexDirection: "column", width: "15%"}}>
                    {!Number.isNaN(Number(tableIndex)) &&
                        <VirtualizedTableItems
                            headerText={Object.keys(item.tables)[tableIndex]}
                            itemInTableIndex={itemInTableIndex}
                            onItemInTableSelected={this.onItemInTableSelected}
                            table={Object.values(item.tables)[tableIndex]}
                        />
                    }
                </div>
                <div id={"cones-comparison"} style={{width: "50%"}}>
                    {!Number.isNaN(Number(itemInTableIndex)) &&
                        <VirtualizedComparison
                            informationTable={projectResult.informationTable}
                            itemIndex={item.id}
                            itemInTableIndex={itemInTableIndex}
                        />
                    }
                </div>
            </RuleWorkDialog>
        );
    }
}

ConesDialog.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        traits: PropTypes.object,
        actions: PropTypes.object,
        tables: PropTypes.object.isRequired
    }),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    projectResult: PropTypes.object,
};

export default ConesDialog;