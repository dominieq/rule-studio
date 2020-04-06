import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import RuleWorkDialog from "../RuleWorkDialog";
import ObjectTable from "../Elements/ObjectTable";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";

class CrossValidationDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            itemInTableIndex: undefined
        };
    }

    onExited = () => {
        this.setState({
            itemInTableIndex: undefined,
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
        const { attributes, objects } = item.traits;

        return (
            <RuleWorkDialog onExited={this.onExited} title={"Selected object: " + item.name} {...other}>
                <div id={"cross-validation-item-details"}>
                    <ObjectTable
                        informationTable={{attributes, objects}}
                        objectIndex={item.id}
                        objectHeader={item.name}
                    />
                </div>
                <div id={"cross-validation-rules-table"} style={{display: "flex", flexDirection: "column"}}>
                    <TableItemsList
                        headerText={"Indices of covering rules"}
                        itemIndex={itemInTableIndex}
                        itemText={"Rule"}
                        onItemInTableSelected={this.onItemInTableSelected}
                        table={item.tables.indicesOfCoveringRules}
                    />
                </div>
                <div id={"cross-validation-rule-characteristics"}>
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

CrossValidationDialog.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        traits: PropTypes.exact({
            attributes: PropTypes.arrayOf(PropTypes.object),
            objects: PropTypes.arrayOf(PropTypes.object),
            suggestedDecision: PropTypes.string
        }).isRequired,
        actions: PropTypes.object,
        tables: PropTypes.exact({
            indicesOfCoveringRules: PropTypes.arrayOf(PropTypes.number)
        }).isRequired
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    ruleSet: PropTypes.arrayOf(PropTypes.object)
};

export default CrossValidationDialog;