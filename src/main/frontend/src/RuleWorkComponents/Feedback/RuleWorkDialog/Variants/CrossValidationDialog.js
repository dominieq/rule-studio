import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import RuleWorkDialog from "../RuleWorkDialog";
import ObjectTable from "../Elements/ObjectTable";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";
import RuleTable, { estimateTableHeight } from "../Elements/RuleTable";

class CrossValidationDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            itemInTableIndex: undefined,
            ruleTableHeight: 0
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { itemInTableIndex } = this.state;

        if (!Number.isNaN(Number(itemInTableIndex))) {
            const { ruleSet } = this.props;
            let height = estimateTableHeight(ruleSet[itemInTableIndex].rule);

            if (prevState.ruleTableHeight !== height) {
                this.setState({
                    ruleTableHeight: height
                });
            }
        }
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

    getCrossValidationTitle = () => {
        const { item } = this.props;

        return (
            <ColouredTitle
                text={[
                    { primary: "Selected object:" },
                    { ...item.name, brackets: false, }
                ]}
            />
        )
    }

    render() {
        const { itemInTableIndex, ruleTableHeight } = this.state;
        const { item, ruleSet, ...other } = this.props;
        const { attributes, objects, suggestedDecision } = item.traits;

        return (
            <RuleWorkDialog
                onEntered={this.onEntered}
                onExited={this.onExited}
                optional={"Suggested decision: " + suggestedDecision}
                title={this.getCrossValidationTitle()}
                {...other}
            >
                <div id={"cross-validation-item-details"} style={{width: "40%"}}>
                    <ObjectTable
                        informationTable={{attributes, objects}}
                        objectIndex={item.id}
                        objectHeader={item.name.toString()}
                    />
                </div>
                <div
                    id={"cross-validation-rules-table"}
                    style={{display: "flex", flexDirection: "column", width: "15%"}}
                >
                    <TableItemsList
                        headerText={"Indices of covering rules"}
                        itemIndex={itemInTableIndex}
                        itemText={"Rule"}
                        onItemInTableSelected={this.onItemInTableSelected}
                        table={item.tables.indicesOfCoveringRules}
                    />
                </div>
                <div
                    id={"cross-validation-rule-characteristics"}
                    style={{display: "flex", flexDirection: "column", width: "40%"}}
                >
                    {!Number.isNaN(Number(itemInTableIndex)) &&
                        <Fragment>
                            <div id={"rule-table"} style={{marginBottom: "5%", minHeight: ruleTableHeight}}>
                                <RuleTable rule={ruleSet[itemInTableIndex].rule} />
                            </div>
                            <div id={"traits-table"} style={{flexGrow: 1}}>
                                <TraitsTable traits={ruleSet[itemInTableIndex].ruleCharacteristics} />
                            </div>
                        </Fragment>
                    }
                </div>
            </RuleWorkDialog>
        );
    }
}

CrossValidationDialog.propTypes = {
    item: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.shape({
            primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            toString: PropTypes.func
        }),
        traits: PropTypes.exact({
            attributes: PropTypes.arrayOf(PropTypes.object),
            objects: PropTypes.arrayOf(PropTypes.object),
            suggestedDecision: PropTypes.string
        }),
        tables: PropTypes.exact({
            indicesOfCoveringRules: PropTypes.arrayOf(PropTypes.number)
        }),
        toFilter: PropTypes.func
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    ruleSet: PropTypes.arrayOf(PropTypes.object)
};

export default CrossValidationDialog;