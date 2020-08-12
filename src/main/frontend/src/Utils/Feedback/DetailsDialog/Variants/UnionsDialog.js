import React from "react";
import PropTypes from "prop-types";
import { getItemName } from "../../../utilFunctions/parseItems";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import { FullscreenDialog, FullscreenHeader, MultiColumns} from "../../../DataDisplay/FullscreenDialog";
import ObjectTable from "../Elements/ObjectTable";
import TableItemsList from "../Elements/TableItemsList";
import TablesList from "../Elements/TablesList";
import TraitsTable from "../Elements/TraitsTable";

/**
 * The fullscreen dialog with details of a selected union.
 *
 * @name Union Details Dialog
 * @constructor
 * @category Details Dialog
 * @param props {Object} - Any other props will be forwarded to the {@link FullscreenDialog} element.
 * @param props.item {Object} - The selected union with it's characteristics.
 * @param props.item.id {number} - The id of a selected union.
 * @param props.item.name {Object} - The name of a selected union.
 * @param props.item.name.primary {number|string} - The part of a name coloured with a primary colour.
 * @param props.item.name.secondary {number|string} - The part of a name coloured with a secondary colour.
 * @param props.item.name.toString {function} - Returns name as a single string.
 * @param props.item.traits {Object} - The characteristics of a selected union in a key-value form.
 * @param props.item.traits.Accuracy_of_approximation {number}
 * @param props.item.traits.Quality_of_approximation {number}
 * @param props.item.tables {Object} - The characteristics of a selected union in a key-array form.
 * @param props.item.tables.Lower_approximation {number[]}
 * @param props.item.tables.Upper_approximation {number[]}
 * @param props.item.tables.Boundary {number[]}
 * @param props.item.tables.Positive_region {number[]}
 * @param props.item.tables.Negative_region {number[]}
 * @param props.item.tables.Objects {number[]}
 * @param props.item.toFilter {function} - Returns item in an easy to filter form.
 * @param props.open {boolean} - If <code>true</code> the Dialog is open.
 * @param props.onClose {function} - Callback fired when the component requests to be closed.
 * @param props.projectResult {Object} - Part of a project received from server.
 * @param props.settings {Object} - Project settings
 * @param props.settings.indexOption {string} - Determines what should be displayed as an object's name.
 * @returns {React.PureComponent}
 */
class UnionsDialog extends React.PureComponent {
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

    getUnionsTitle = () => {
        const { item } = this.props;

        return (
            <ColouredTitle
                text={[
                    { primary: "Selected union:" },
                    { ...item.name, brackets: false }
                ]}
            />
        )
    };

    getName = (index) => {
        const { projectResult: { informationTable: { objects } }, settings } = this.props;

        if (objects && settings) {
            return getItemName(index, objects, settings).toString();
        } else {
            return undefined;
        }
    }

    render() {
        const { tableIndex, itemInTableIndex } = this.state;
        const { item, projectResult, ...other}  = this.props;

        return (
            <FullscreenDialog onExited={this.onExited} {...other}>
                <FullscreenHeader
                    id={"unions-details-header"}
                    onClose={this.props.onClose}
                    title={this.getUnionsTitle()}
                />
                <MultiColumns>
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
                                getName={this.getName}
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
                                columnsLabels={{key: "Name", value: "Value"}}
                                traits={item.traits}
                            />
                        </div>
                        <div style={{flexGrow: 1}}>
                            {!Number.isNaN(Number(itemInTableIndex)) &&
                                <ObjectTable
                                    informationTable={projectResult.informationTable}
                                    objectIndex={itemInTableIndex}
                                    objectHeader={this.getName(itemInTableIndex).toString()}
                                />
                            }
                        </div>
                    </div>
                </MultiColumns>
            </FullscreenDialog>
        );
    }
}

UnionsDialog.propTypes = {
    item: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.shape({
            primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            toString: PropTypes.func
        }),
        traits: PropTypes.exact({
            'Accuracy of approximation': PropTypes.number,
            'Quality of approximation': PropTypes.number,
        }),
        tables: PropTypes.exact({
            'Lower approximation': PropTypes.arrayOf(PropTypes.number),
            'Upper approximation': PropTypes.arrayOf(PropTypes.number),
            'Boundary': PropTypes.arrayOf(PropTypes.number),
            'Positive region': PropTypes.arrayOf(PropTypes.number),
            'Negative region': PropTypes.arrayOf(PropTypes.number),
            'Boundary region': PropTypes.arrayOf(PropTypes.number),
            'Objects': PropTypes.arrayOf(PropTypes.number)
        }),
        toFilter: PropTypes.func
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool,
    projectResult: PropTypes.object.isRequired,
    settings: PropTypes.shape({
        indexOption: PropTypes.string.isRequired
    })
};

export default UnionsDialog;