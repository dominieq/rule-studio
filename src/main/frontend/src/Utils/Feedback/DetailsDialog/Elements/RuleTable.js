import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { getRuleName } from "../../../utilFunctions/parseItems";
import TextWithHoverTooltip, { PlainText } from "../../../DataDisplay/TextWithHoverTooltip";
import { AutoSizer, List } from "react-virtualized";

const listStyles = makeStyles(theme => ({
    root: {
        '& .ReactVirtualized__Grid__innerScrollContainer': {
            backgroundColor: theme.palette.background.main1
        }
    },
    row: {
        alignItems: "center",
        display: "flex",
        padding: "8px 16px",
    },
    primary: {
        color: theme.palette.text.main1
    },
    secondary: {
        color: theme.palette.text.special1
    }
}), {name: "rule-table"});

export const estimateTableHeight = (rule, rowHeight = 36) => {
    return (1 + rule.conditions.length) * rowHeight;
};

const ruleToList = (rule) => {
    if (rule && Object.keys(rule).length) {
        let ruleName = getRuleName(rule);

        return [
            {
                secondary: ruleName.decisionsToString(),
                type: "decision",
            },
            ...ruleName.conditions.map(condition => {
                return {
                    primary: condition.primary,
                    secondary: condition.secondary,
                    text: condition.toString(),
                    type: "condition"
                };
            })
        ];
    } else {
        return [];
    }
};

/**
 * An AutoSizer and List component from react-virtualized library with custom styling.
 * Used to display rule in an {@link ClassifiedObjectDialog}.
 * <br>
 * For full documentation check out react-virtualized docs on
 * <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md" target="_blank">AutoSizer</a>
 * and
 * <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md" target="_blank">List</a>.
 *
 * @name RuleTable
 * @constructor
 * @category Details Dialog
 * @subcategory Utilities
 * @param props {Object}
 * @param [props.listRef] {Object} - Reference forwarded to the List component.
 * @param [props.rowHeight = 36] {number} - The height of the row in the List component.
 * @param props.rule {Object} - The selected rule.
 * @param props.rule.conditions {Object[]} - The conditions part of a selected rule.
 * @param props.rule.conditions[].toString {string} - Conditions as a single string.
 * @param props.rule.conditions[].attributeName {string} - The name of the evaluated attribute.
 * @param props.rule.conditions[].relationSymbol {string} - The relation symbol used to evaluate attribute
 * @param props.rule.conditions[].limitingEvaluation {number|string} - The value of limiting evaluation
 * @param props.rule.decisions {Object[][]} - The decisions part of a selected rule.
 * @param props.rule.decisions[][].toString {string} - Decisions as single string.
 * @param props.rule.decisions[][].attributeName {string} - The name of the evaluated attribute.
 * @param props.rule.decisions[][].relationSymbol {string} - The relation symbol used to evaluate attribute.
 * @param props.rule.decisions[][].limitingEvaluation {number|string} - The value of limiting evaluation.
 * @param props.rule.toString {string} - Rule as a single string.
 * @param props.rule.type {string} - The type of a rule.
 * @returns {React.ReactElement}
 */
function RuleTable(props) {
    const { rowHeight } = props;
    const listClasses =  listStyles();
    const ruleList = ruleToList(props.rule);

    const rowRenderer = ({index, key, style}) => {
        let rulePart = ruleList[index];

        return (
            <div className={listClasses.row} key={key} style={style}>
                {rulePart.type === 'decision' &&
                    <TextWithHoverTooltip
                        text={rulePart.secondary}
                        TypographyProps={{
                            className: listClasses.secondary
                        }}
                    />
                }
                {rulePart.type === 'condition' &&
                    <TextWithHoverTooltip text={rulePart.text}>
                        <PlainText className={listClasses.primary} noWrap={true}>
                            {rulePart.primary}
                        </PlainText>
                        <PlainText className={listClasses.secondary} noWrap={true}>
                            {rulePart.secondary}
                        </PlainText>
                    </TextWithHoverTooltip>
                }
            </div>
        )
    };

    return (
        <AutoSizer>
            {({height, width}) => (
                <List
                    className={listClasses.root}
                    height={height}
                    rowCount={ruleList.length}
                    rowHeight={rowHeight}
                    rowRenderer={rowRenderer}
                    style={{outline: "none"}}
                    width={width}
                />
            )}
        </AutoSizer>
    )
}

RuleTable.propTypes = {
    listRef: PropTypes.object,
    rowHeight: PropTypes.number,
    rule: PropTypes.exact({
        conditions:  PropTypes.arrayOf(PropTypes.exact({
            toString: PropTypes.string,
            attributeName: PropTypes.string,
            relationSymbol: PropTypes.string,
            limitingEvaluation: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        })),
        decisions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.exact({
            toString: PropTypes.string,
            attributeName: PropTypes.string,
            relationSymbol: PropTypes.string,
            limitingEvaluation: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        }))),
        toString: PropTypes.string,
        type: PropTypes.string,
    })
};

RuleTable.defaultProps = {
    rowHeight: 36
}

export default RuleTable;
