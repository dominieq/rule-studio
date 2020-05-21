import React from "react";
import PropTypes from "prop-types";
import { getItemName } from "../../../../Body/Project/Utils/parseData";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import { FullscreenDialog, FullscreenHeader, MultiColumns } from "../../../DataDisplay/FullscreenDialog";
import { getTitleConditions, getTitleDecisions } from "../Utils";
import ObjectTable from "../Elements/ObjectTable";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";

class RulesDialog extends React.PureComponent {
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

    getRulesTitle = () => {
        const { item } = this.props;

        return (
            <ColouredTitle
                text={[
                    { primary: `Rule ${item.id + 1}: ` },
                    ...getTitleDecisions(item.name.decisions),
                    { secondary: "\u2190" },
                    ...getTitleConditions(item.name.conditions)
                ]}
            />
        );
    };

    getItemsStyle = (index) => {
        const { item: { tables: { isSupportingObject } } } = this.props;

        if (isSupportingObject[index]) {
            return {
                borderLeft: "4px solid green"
            };
        } else {
            return {
                borderLeft: "4px solid red"
            };
        }
    };

    getName = (index) => {
        const { projectResult: { informationTable: { objects } }, settings } = this.props;

        if (objects && settings) {
            return getItemName(index, objects, settings).toString();
        } else {
            return undefined;
        }
    };

    render() {
        const { itemInTableIndex } = this.state;
        const { item, projectResult, ...other } = this.props;

        let displayTraits = { ...item.traits };
        delete displayTraits["Type"];

        return (
            <FullscreenDialog onExited={this.onExited} {...other}>
                <FullscreenHeader
                    id={"rules-details-header"}
                    onClose={this.props.onClose}
                    title={this.getRulesTitle()}
                />
                <MultiColumns>
                    <div id={"rules-traits"}>
                        <TraitsTable
                            traits={displayTraits}
                        />
                    </div>
                    <div id={"rules-table-content"} style={{display: "flex", flexDirection: "column", width: "20%"}}>
                        <TableItemsList
                            getItemsStyle={this.getItemsStyle}
                            getName={this.getName}
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
                                objectHeader={this.getName(itemInTableIndex).toString()}
                            />
                        }
                    </div>
                </MultiColumns>
            </FullscreenDialog>
        );
    }
}

RulesDialog.propTypes = {
    item: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.exact({
            decisions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
                primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                toString: PropTypes.func,
                withBraces: PropTypes.func,
            }))),
            conditions: PropTypes.arrayOf(PropTypes.shape({
                primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                toString: PropTypes.func,
            })),
            decisionsToString: PropTypes.func,
            conditionsToString: PropTypes.func,
            toString: PropTypes.func
        }),
        traits: PropTypes.shape({
            "Type": PropTypes.string
        }),
        tables: PropTypes.shape({
            indicesOfCoveredObjects: PropTypes.arrayOf(PropTypes.number),
            isSupportingObject: PropTypes.arrayOf(PropTypes.bool)
        }),
        toFilter: PropTypes.func,
        toSort: PropTypes.func,
    }),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    projectResult: PropTypes.object.isRequired,
    settings: PropTypes.shape({
        indexOption: PropTypes.string.isRequired
    })
};

export default RulesDialog;