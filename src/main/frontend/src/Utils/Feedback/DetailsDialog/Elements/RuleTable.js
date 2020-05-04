import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { getRuleName } from "../../../../Body/Project/Utils/parseData";
import TextWithHoverTooltip, { PlainText } from "../../../DataDisplay/TextWithHoverTooltip";
import { AutoSizer, List } from "react-virtualized";

const listStyles = makeStyles(theme => ({
    root: {
        '& .ReactVirtualized__Grid__innerScrollContainer': {
            backgroundColor: theme.palette.list.background
        }
    },
    row: {
        alignItems: "center",
        display: "flex",
        padding: "8px 16px",
    },
    primary: {
        color: theme.palette.button.primary
    },
    secondary: {
        color: theme.palette.button.secondary
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