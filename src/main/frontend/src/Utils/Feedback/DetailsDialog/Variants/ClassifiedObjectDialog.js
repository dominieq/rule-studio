import React from "react";
import PropTypes from "prop-types";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import { FullscreenDialog, MultiColumns, FullscreenHeader } from "../../../DataDisplay/FullscreenDialog";
import { Slides } from "../../../Navigation/Slides";
import ObjectTable from "../Elements/ObjectTable";
import RuleTable, { estimateTableHeight } from "../Elements/RuleTable";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";

class ClassifiedObjectDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            direction: "forward",
            itemInTableIndex: undefined,
            ruleTableHeight: 0,
            slide: 0,
            sliding: false
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
            direction: "forward",
            itemInTableIndex: undefined,
            slide: 0
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

    slide = (direction, nextSlide) => {
        this.setState({
            direction: direction,
            sliding: true
        }, () => {
            setTimeout(() => this.setState({
                direction: "forward",
                slide: nextSlide,
                sliding: false
            }), 1000);
        });
    }

    render() {
        const { direction, itemInTableIndex, ruleTableHeight, slide, sliding } = this.state;
        const { item, ruleSet, ...other } = this.props;
        const { attributes, objects, originalDecision, suggestedDecision, certainty } = item.traits;

        return (
            <FullscreenDialog onEnter={this.onEnter} {...other}>
                <FullscreenHeader
                    id={"classified-details-header"}
                    onClose={this.props.onClose}
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
                />
                <Slides direction={direction} sliding={sliding} value={slide}>
                    <MultiColumns>
                        <div id={"classified-object"} style={{width: "40%"}}>
                            <ObjectTable
                                informationTable={{attributes, objects}}
                                objectIndex={item.id}
                                objectHeader={item.name.toString()}
                            />
                        </div>
                        <div
                            id={"classified-covering-rules"}
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
                            id={"classified-rules-traits"}
                            style={{display: "flex", flexDirection: "column", width: "40%"}}
                        >
                            {!Number.isNaN(Number(itemInTableIndex)) &&
                                <React.Fragment>
                                    <div
                                        id={"rule-table"}
                                        onClick={() => this.slide("forward", 1)}
                                        style={{marginBottom: "5%", minHeight: ruleTableHeight}}
                                    >
                                        <RuleTable rule={ruleSet[itemInTableIndex].rule} />
                                    </div>
                                    <div id={"traits-table"} style={{flexGrow: 1}}>
                                        <TraitsTable traits={ruleSet[itemInTableIndex].ruleCharacteristics} />
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    </MultiColumns>
                    <MultiColumns>

                    </MultiColumns>
                </Slides>
            </FullscreenDialog>
        );
    }
}

ClassifiedObjectDialog.propTypes = {
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

export default ClassifiedObjectDialog;
