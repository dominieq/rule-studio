import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { getRuleName } from "../utilFunctions/parseItems";
import TextWithHoverTooltip, { PlainText } from "./TextWithHoverTooltip";
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
 * <h3>Overview</h3>
 * An AutoSizer and List component from react-virtualized library with custom styling.
 * Used to display rule in an {@link ClassifiedObjectDialog}.
 * <br>
 * For full documentation check out react-virtualized docs on
 * <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md" target="_blank">AutoSizer</a>
 * and
 * <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md" target="_blank">List</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Data Display
 * @param {Object} props
 * @param {Object} [props.listRef] - Reference forwarded to the List component.
 * @param {number} [props.rowHeight = 36] - The height of the row in the List component.
 * @param {Object} props.rule - The selected rule.
 * @param {Object[]} props.rule.conditions - The conditions part of a selected rule.
 * @param {string} props.rule.conditions[].toString - Conditions as a single string.
 * @param {string} props.rule.conditions[].attributeName - The name of the evaluated attribute.
 * @param {string} props.rule.conditions[].relationSymbol - The relation symbol used to evaluate attribute
 * @param {number|string} props.rule.conditions[].limitingEvaluation - The value of limiting evaluation
 * @param {Object[][]} props.rule.decisions - The decisions part of a selected rule.
 * @param {string} props.rule.decisions[][].toString - Decisions as single string.
 * @param {string} props.rule.decisions[][].attributeName - The name of the evaluated attribute.
 * @param {string} props.rule.decisions[][].relationSymbol - The relation symbol used to evaluate attribute.
 * @param {number|string} props.rule.decisions[][].limitingEvaluation - The value of limiting evaluation.
 * @param {string} props.rule.toString - Rule as a single string.
 * @param {string} props.rule.type - The type of a rule.
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
