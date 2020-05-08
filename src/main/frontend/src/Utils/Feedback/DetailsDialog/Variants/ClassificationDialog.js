import React, {PureComponent, Fragment} from "react";
import PropTypes from "prop-types";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import DetailsDialog from "../DetailsDialog";
import ObjectTable from "../Elements/ObjectTable";
import RuleTable, { estimateTableHeight } from "../Elements/RuleTable";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";

class ClassificationDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            itemInTableIndex: undefined,
            ruleTableHeight: 0,
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

    onEnter = () => {
        this.setState({
            itemInTableIndex: undefined
        });
    };

    onItemInTableSelected = (index) => {
        this.setState({
            itemInTableIndex: index
        });
    };

    getClassificationTitle = () => {
        const { item } = this.props;

        return (
            <ColouredTitle
                text={[
                    { primary: "Selected object:"},
                    { ...item.name, brackets: false, }
                ]}
            />
        );
    };

    render() {
        const { itemInTableIndex, ruleTableHeight } = this.state;
        const { item, ruleSet, ...other } = this.props;
        const { attributes, objects, originalDecision, suggestedDecision, certainty } = item.traits;

        return (
            <DetailsDialog
                onEnter={this.onEnter}
                optional={
                    <React.Fragment>
                        <span aria-label={"original-decision"}>
                            {`Original decision: ${originalDecision}`}
                        </span>
                        <span aria-label={"suggested-decision"}>
                            {`Certainty: ${certainty}   |   Suggested decision: ${suggestedDecision}`}
                        </span>
                    </React.Fragment>
                }
                title={this.getClassificationTitle()}
                {...other}
            >
                <div id={"classification-object"} style={{width: "40%"}}>
                    <ObjectTable
                        informationTable={{attributes, objects}}
                        objectIndex={item.id}
                        objectHeader={item.name.toString()}
                    />
                </div>
                <div id={"classification-rules"} style={{display: "flex", flexDirection: "column", width: "15%"}}>
                    <TableItemsList
                        headerText={"Indices of covering rules"}
                        itemIndex={itemInTableIndex}
                        itemText={"Rule"}
                        onItemInTableSelected={this.onItemInTableSelected}
                        table={item.tables.indicesOfCoveringRules}
                    />
                </div>
                <div
                    id={"classification-rules-traits"}
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
            </DetailsDialog>
        );
    }
}

ClassificationDialog.propTypes = {
    item: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.shape({
            primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            toString: PropTypes.func
        }),
        traits: PropTypes.shape({
            attributes: PropTypes.arrayOf(PropTypes.object),
            objects: PropTypes.arrayOf(PropTypes.object),
            originalDecision: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            suggestedDecision: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            certainty: PropTypes.number
        }),
        tables: PropTypes.shape({
            indicesOfCoveringRules: PropTypes.arrayOf(PropTypes.number)
        }),
        toFilter: PropTypes.func
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    ruleSet: PropTypes.arrayOf(PropTypes.object),
};

export default ClassificationDialog;
