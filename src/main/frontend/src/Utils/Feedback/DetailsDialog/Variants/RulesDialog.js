import React from "react";
import PropTypes from "prop-types";
import { getItemName } from "../../../utilFunctions/parseItems";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import { FullscreenDialog, FullscreenHeader, MultiColumns } from "../../../DataDisplay/FullscreenDialog";
import { getTitleConditions, getTitleDecisions } from "../Utils";
import ObjectTable from "../Elements/ObjectTable";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";

/**
 * The fullscreen dialog with details of a selected rule.
 *
 * @name Rule Details Dialog
 * @constructor
 * @category Details Dialog
 * @param props {Object} - Any other props will be forwarded to the {@link FullscreenDialog} element.
 * @param props.item {Object} - The selected rule with it's characteristics.
 * @param props.item.id {number} - The id of a selected rule.
 * @param props.item.name {Object} - The name of a selected rule.
 * @param props.item.name.decisions {Object[][]} - The decision part of a rule
 * @param props.item.name.decisions[][].primary {number|string} - The part of the decision coloured with primary colour.
 * @param props.item.name.decisions[][].secondary {number|string} - The part of the decision coloured with secondary colour.
 * @param props.item.name.decisions[][].withBraces {boolean} - If <code>true</code> braces will be added to decision.
 * @param props.item.name.decisions[][].toString {function} - Returns decision as a single string.
 * @param props.item.name.conditions {Object[]} - The condition part of a rule.
 * @param props.item.name.conditions[].primary {number|string} - The part of the condition coloured with primary colour.
 * @param props.item.name.conditions[].secondary {number|string} - The part of the condition coloured with secondary colour.
 * @param props.item.name.conditions[].toString {function} - Returns condition as a single string.
 * @param props.item.name.decisionsToString {function} - Returns decisions as a single string concatenated with a logical AND and OR.
 * @param props.item.name.conditionsToString {function} - Returns conditions as a single string concatenated with a logical AND.
 * @param props.item.name.toString {function} - Returns concatenated output of <code>decisionsToString</code> and <code>conditionsToString</code>.
 * @param props.item.traits {Object} - The characteristics of a selected rule in a key-value form.
 * @param [props.item.traits.Type] {string}
 * @param props.item.tables {Object} - The characteristics of a selected rule in a key-array form.
 * @param [props.item.tables.indicesOfCoveredObjects] {number[]}
 * @param [props.item.tables.isSupportingObject] {boolean[]}
 * @param props.item.toFilter {function} - Returns rule in an easy to filter form.
 * @param props.item.toSort {function} - Returns rule in an easy to sort form.
 * @param props.open {boolean} - If <code>true</code> the Dialog is open.
 * @param props.onClose {function} - Callback fired when the component requests to be closed.
 * @param props.projectResult {Object} - Part of a project received from server.
 * @param props.settings {Object} - Project settings.
 * @param props.settings.indexOption {string} - Determines what should be displayed as an object's name.
 * @returns {React.PureComponent}
 */
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
                            headerText={"Covered objects"}
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