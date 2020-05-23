import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { getItemName, getRuleName } from "../../../../Body/Project/Utils/parseData";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import CustomTooltip from "../../../DataDisplay/CustomTooltip";
import { FullscreenDialog, MultiColumns, FullscreenHeader } from "../../../DataDisplay/FullscreenDialog";
import { Slides } from "../../../Navigation/Slides";
import CustomHeader from "../../../Surfaces/CustomHeader";
import { getTitleConditions, getTitleDecisions } from "../Utils";
import ObjectTable from "../Elements/ObjectTable";
import RuleTable, { estimateTableHeight } from "../Elements/RuleTable";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Fade from "@material-ui/core/Fade";

const StyledMenu = withStyles(theme => ({
    list: {
        backgroundColor: theme.palette.background.sub,
        color: theme.palette.text.main2
    }
}), {name: "ContextMenu"})(props => <Menu {...props} />);

class ClassifiedObjectDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            direction: "forward",
            itemInTableIndex: undefined,
            mouseX: null,
            mouseY: null,
            ruleInTableIndex: undefined,
            ruleTableHeight: 0,
            slide: 0,
            sliding: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { ruleInTableIndex } = this.state;

        if (!Number.isNaN(Number(ruleInTableIndex))) {
            const { ruleSet } = this.props;
            let height = estimateTableHeight(ruleSet[ruleInTableIndex].rule);

            if (prevState.ruleTableHeight !== height) {
                this.setState({
                    ruleTableHeight: height
                });
            }
        }
    }

    onContextMenu = (event) => {
        event.preventDefault();

        this.setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4
        });
    };

    onContextMenuClose = () => {
        this.setState({
            mouseX: null,
            mouseY: null
        });
    };

    onEnter = () => {
        this.setState({
            direction: "forward",
            ruleInTableIndex: undefined,
            slide: 0
        });
    };

    onEscapeKeyDown = () => {
        const { slide } = this.state;

        if (slide === 0) {
            this.props.onClose();
        } else {
            this.slide("backward", 0);
        }
    };

    onItemInTableSelected = (index) => {
        this.setState({
            itemInTableIndex: index
        });
    };

    onRuleInTableSelected = (index) => {
        this.setState({
            ruleInTableIndex: index
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

    getRulesTitle = () => {
        const { ruleInTableIndex } = this.state;

        if (!Number.isNaN(Number(ruleInTableIndex))) {
            const { ruleSet } = this.props;
            const ruleName = getRuleName(ruleSet[ruleInTableIndex].rule);

            return (
                <ColouredTitle
                    text={[
                        { primary: `Rule ${ruleInTableIndex + 1}: ` },
                        ...getTitleDecisions(ruleName.decisions),
                        { secondary: "\u2190" },
                        ...getTitleConditions(ruleName.conditions)
                    ]}
                />
            );
        } else {
            return (
                <div style={{display: "none"}}/>
            );
        }
    };

    getCoveredObjectName = (index) => {
        const { informationTable: { objects }, settings } = this.props;

        if (objects != null && settings != null) {
            return getItemName(index, objects, settings).toString();
        } else {
            return undefined;
        }
    };

    getCoveredObjectStyle = (index) => {
        const { ruleInTableIndex } = this.state;
        const { ruleSet } = this.props;

        if (!Number.isNaN(Number(ruleInTableIndex))) {
            const { isSupportingObject } = ruleSet[ruleInTableIndex];

            if (isSupportingObject[index]) {
                return {
                    borderLeft: "4px solid green"
                };
            } else {
                return {
                    borderLeft: "4px solid red"
                };
            }
        } else {
            return {};
        }
    };

    getSlotStyle = (index) => {
        if (index === 1) {
            return { width: "100%" };
        } else {
            return {};
        }
    };

    getHeaderStyle = (index) => {
        const { sliding } = this.state;
        let style = { display: "flex", flex: "1 0 100%" };

        if (sliding && index === 1) {
            style = { ...style, overflowX: "hidden" };
        }

        return style;
    };

    slide = (direction, nextSlide) => {
        this.setState({
            direction: direction,
            sliding: true
        }, () => {
            setTimeout(() => this.setState(({itemInTableIndex}) => ({
                direction: "forward",
                itemInTableIndex: nextSlide === 0 ? undefined : itemInTableIndex,
                slide: nextSlide,
                sliding: false
            })), 1000);
        });
    }

    render() {
        const {
            direction,
            itemInTableIndex,
            mouseX,
            mouseY,
            ruleInTableIndex,
            ruleTableHeight,
            slide,
            sliding
        } = this.state;
        const { informationTable, item, ruleSet, settings, ...other } = this.props;
        const { attributes, objects, originalDecision, suggestedDecision, certainty } = item.traits;

        return (
            <FullscreenDialog
                disableEscapeKeyDown={true}
                onEnter={this.onEnter}
                onEscapeKeyDown={this.onEscapeKeyDown}
                {...other}
            >
                <CustomHeader style={{ padding: 0 }}>
                    <Slides
                        direction={direction}
                        getSlotStyle={this.getSlotStyle}
                        sliding={sliding}
                        value={slide}
                    >
                        <FullscreenHeader
                            HeaderComponent={"div"}
                            HeaderProps={{ style: { ...this.getHeaderStyle(0) }}}
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
                        <FullscreenHeader
                            closeIcon={<ArrowBack />}
                            CloseButtonProps={{
                                onMouseEnter: undefined,
                                onMouseLeave: undefined
                            }}
                            CloseTooltipProps={{ title: "Go back" }}
                            HeaderComponent={"div"}
                            HeaderProps={{ style: { ...this.getHeaderStyle(1) }}}
                            id={"classified-rules-header"}
                            onClose={() => this.slide("backward", 0)}
                            title={this.getRulesTitle()}
                        />
                    </Slides>
                </CustomHeader>
                <Slides
                    direction={direction}
                    sliding={sliding}
                    value={slide}
                >
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
                                headerText={"Covering rules"}
                                itemIndex={ruleInTableIndex}
                                itemText={"Rule"}
                                onItemInTableSelected={this.onRuleInTableSelected}
                                table={item.tables.indicesOfCoveringRules}
                            />
                        </div>
                        <div
                            id={"classified-rules-traits"}
                            style={{display: "flex", flexDirection: "column", width: "40%"}}
                        >
                            {!Number.isNaN(Number(ruleInTableIndex)) &&
                                <React.Fragment>
                                    <CustomTooltip
                                        arrow={true}
                                        enterDelay={500}
                                        enterNextDelay={500}
                                        placement={"top"}
                                        title={"Right click to open menu"}
                                        WrapperProps={{
                                            id: "rule-table",
                                            onContextMenu: this.onContextMenu,
                                            style: { marginBottom: "5%", minHeight: ruleTableHeight }
                                        }}
                                    >
                                        <RuleTable rule={ruleSet[ruleInTableIndex].rule} />
                                    </CustomTooltip>
                                    <div id={"traits-table"} style={{flexGrow: 1}}>
                                        <TraitsTable traits={ruleSet[ruleInTableIndex].ruleCharacteristics} />
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    </MultiColumns>
                    <MultiColumns>
                        <div id={"rule-traits"}>
                            {!Number.isNaN(Number(ruleInTableIndex)) &&
                                <TraitsTable
                                    traits={ruleSet[ruleInTableIndex].ruleCharacteristics}
                                />
                            }
                        </div>
                        <div
                            id={"rule-covered-object-list"}
                            style={{ display: "flex", flexDirection: "column", width: "20%"}}
                        >
                            {!Number.isNaN(Number(ruleInTableIndex)) &&
                                <TableItemsList
                                    getItemsStyle={this.getCoveredObjectStyle}
                                    getName={this.getCoveredObjectName}
                                    headerText={"Covered objects"}
                                    itemIndex={itemInTableIndex}
                                    onItemInTableSelected={this.onItemInTableSelected}
                                    table={ruleSet[ruleInTableIndex].indicesOfCoveredObjects}
                                />
                            }
                        </div>
                        <div id={"rule-covered-object-details"} style={{ width: "40%" }}>
                            {!Number.isNaN(Number(itemInTableIndex)) &&
                                <ObjectTable
                                    informationTable={informationTable}
                                    objectIndex={itemInTableIndex}
                                    objectHeader={this.getCoveredObjectName(itemInTableIndex).toString()}
                                />
                            }
                        </div>
                    </MultiColumns>
                </Slides>
                <StyledMenu
                    anchorPosition={
                        mouseX !== null && mouseY !== null
                            ? { top: mouseY, left: mouseX }
                            : undefined
                    }
                    anchorReference={"anchorPosition"}
                    keepMounted={true}
                    onClose={this.onContextMenuClose}
                    open={mouseY !== null}
                    TransitionComponent={Fade}
                >
                    <MenuItem
                        onClick={() => {
                            this.slide("forward", 1);
                            this.onContextMenuClose();
                        }}
                    >
                        Show rule's details
                    </MenuItem>
                </StyledMenu>
            </FullscreenDialog>
        );
    }
}

ClassifiedObjectDialog.propTypes = {
    informationTable: PropTypes.exact({
        attributes: PropTypes.array,
        objects: PropTypes.array
    }),
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
    settings: PropTypes.shape({
        indexOption: PropTypes.string
    })
};

export default ClassifiedObjectDialog;
