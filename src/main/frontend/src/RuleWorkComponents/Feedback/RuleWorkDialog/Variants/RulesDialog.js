import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { getItemName } from "../../../../Body/Project/Utils/parseData";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import RuleWorkDialog from "../RuleWorkDialog";
import ObjectTable from "../Elements/ObjectTable";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";

class RulesDialog extends PureComponent {
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

    getDecisions = (decisions) => {
        let titleDecisions = [];
        for (let i = 0; i < decisions.length; i++) {
            let and = [];
            for (let j = 0; j < decisions[i].length; j++) {
                if ( decisions[i].length > 1 ) {
                    and.push(
                        { primary: "(" },
                        { ...decisions[i][j] },
                        { primary: ")" },
                    );
                    if ( j + 1 < decisions[i].length ) {
                        and.push({ secondary: "\u2227" });
                    }
                } else {
                    and.push({ ...decisions[i][j] });
                }
            }
            if ( decisions.length > 1 ) {
                and.unshift({ primary: "[" });
                and.push({ primary: "]" });
                if ( i + 1 < decisions.length ) {
                    and.push({ secondary: "\u2228" });
                }
            }
            titleDecisions.push(...and);
        }
        return titleDecisions;
    };

    getConditions = (conditions) => {
        let titleConditions = [];
        for (let i = 0; i < conditions.length; i++) {
            if ( conditions.length > 1) {
                titleConditions.push(
                    { primary: "(" },
                    { ...conditions[i] },
                    { primary: ")" }
                );
                if ( i + 1 < conditions.length) {
                    titleConditions.push({ secondary: "\u2228" });
                }
            } else {
                titleConditions.push({ ...conditions[i] });
            }
        }
        return titleConditions;
    };

    getRulesTitle = () => {
        const { item } = this.props;

        return (
            <ColouredTitle
                text={[
                    { primary: "Selected rule: " },
                    ...this.getDecisions(item.name.decisions),
                    { secondary: "\u2190" },
                    ...this.getConditions(item.name.conditions)
                ]}
            />
        );
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
        const { itemInTableIndex } = this.state;
        const { item, projectResult, ...other } = this.props;

        return (
            <RuleWorkDialog onExited={this.onExited} title={this.getRulesTitle()} {...other}>
                <div id={"rules-traits"}>
                    <TraitsTable
                        traits={item.traits}
                    />
                </div>
                <div id={"rules-table-content"} style={{display: "flex", flexDirection: "column", width: "20%"}}>
                    <TableItemsList
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
            </RuleWorkDialog>
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
            }))
        }),
        traits: PropTypes.shape({
            "Type": PropTypes.string.isRequired
        }),
        tables: PropTypes.exact({
            indicesOfCoveredObjects: PropTypes.arrayOf(PropTypes.number)
        })
    }),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    projectResult: PropTypes.object.isRequired,
    settings: PropTypes.shape({
        indexOption: PropTypes.string.isRequired
    })
};

export default RulesDialog;