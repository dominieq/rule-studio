import React from "react";
import PropTypes from "prop-types";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import { FullscreenDialog, MultiColumns, FullscreenHeader} from "../../../DataDisplay/FullscreenDialog";
import TablesList from "../Elements/TablesList";
import ObjectsComparisonTable from "../Elements/ObjectsComparisonTable";
import TableItemsList from "../Elements/TableItemsList";

class ConesDialog extends React.PureComponent {
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

    getConesTitle = () => {
        const { item } = this.props;

        return (
            <ColouredTitle
                text={[
                    { primary: "Selected object:" },
                    { ...item.name, brackets: false, }
                ]}
            />
        );
    };

    getName = (index) => {
        const { items } = this.props;
        return items[index].name.toString();
    };

    render() {
        const { tableIndex, itemInTableIndex } = this.state;
        const { item, items, projectResult, ...other } = this.props;

        return (
            <FullscreenDialog onExited={this.onExited} {...other}>
                <FullscreenHeader
                    id={"cones-details-header"}
                    onClose={this.props.onClose}
                    title={this.getConesTitle()}
                />
                <MultiColumns>
                    <div id={"cones-tables"} style={{width: "22.5%"}}>
                        <TablesList
                            headerText={"Dominance cones"}
                            onTableSelected={this.onTableSelected}
                            tableIndex={tableIndex}
                            tables={item.tables}
                        />
                    </div>
                    <div id={"cones-table-content"} style={{display: "flex", flexDirection: "column", width: "22.5%"}}>
                        {!Number.isNaN(Number(tableIndex)) &&
                            <TableItemsList
                                getName={this.getName}
                                headerText={Object.keys(item.tables)[tableIndex]}
                                itemIndex={itemInTableIndex}
                                onItemInTableSelected={this.onItemInTableSelected}
                                table={Object.values(item.tables)[tableIndex]}
                            />
                        }
                    </div>
                    <div id={"cones-comparison"} style={{width: "50%"}}>
                        {!Number.isNaN(Number(itemInTableIndex)) &&
                            <ObjectsComparisonTable
                                informationTable={projectResult.informationTable}
                                objectIndex={item.id}
                                objectHeader={item.name.toString()}
                                objectInTableIndex={itemInTableIndex}
                                objectInTableHeader={items ? items[itemInTableIndex].name.toString() : undefined}
                                tableIndex={tableIndex}
                            />
                        }
                    </div>
                </MultiColumns>
            </FullscreenDialog>
        );
    }
}

ConesDialog.propTypes = {
    item: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.shape({
            primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            toString: PropTypes.func
        }),
        tables: PropTypes.shape({
            'Positive dominance cone': PropTypes.arrayOf(PropTypes.number),
            'Negative dominance cone': PropTypes.arrayOf(PropTypes.number),
            'Positive inverse dominance cone': PropTypes.arrayOf(PropTypes.number),
            'Negative inverse dominance cone': PropTypes.arrayOf(PropTypes.number),
        }),
        toFilter: PropTypes.func
    }),
    items: PropTypes.arrayOf(PropTypes.object),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    projectResult: PropTypes.object,
};

export default ConesDialog;