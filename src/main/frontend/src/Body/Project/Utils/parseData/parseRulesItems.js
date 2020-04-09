import { parseConditions, parseDecisions } from "./utilFunctions";

function parseRulesItems(data) {
    let items = [];

    if (data && Object.keys(data).includes("ruleSet")) {
        for (let i = 0; i < data.ruleSet.length; i++) {
            items.push({
                id: i,
                name: {
                    decisions: parseDecisions(data.ruleSet[i].rule.decisions),
                    conditions: parseConditions(data.ruleSet[i].rule.conditions)
                },
                traits: {
                    "Type": data.ruleSet[i].rule.type.toLowerCase(),
                    ...data.ruleSet[i].ruleCharacteristics
                },
                tables: {
                    indicesOfCoveredObjects: data.ruleSet[i].indicesOfCoveredObjects.slice(),
                }
            });
        }
    }

    return items;
}

export default parseRulesItems

