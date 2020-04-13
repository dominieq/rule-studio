import { parseConditions, parseDecisions } from "./utilFunctions";

function parseRulesItems(data) {
    let items = [];

    if (data && Object.keys(data).includes("ruleSet")) {
        for (let i = 0; i < data.ruleSet.length; i++) {
            items.push({
                id: i,
                name: {
                    decisions: parseDecisions(data.ruleSet[i].rule.decisions),
                    conditions: parseConditions(data.ruleSet[i].rule.conditions),
                    decisionsToString() {
                        return this.decisions.map(and => {
                            return and.map(decision => {
                                if (and.length > 1) {
                                    return decision.withBraces();
                                } else {
                                    return decision.toString();
                                }
                            }).join(" \u2227 ");
                        }).join(" \u2228 ");
                    },
                    conditionsToString() {
                        return this.conditions.map(condition => {
                            if (this.conditions.length > 1) {
                                return condition.withBraces();
                            } else {
                                return condition.toString();
                            }
                        }).join(" \u2227 ")
                    },
                    toString() {
                        return this.decisionsToString() + " \u2190 " + this.conditionsToString();
                    }
                },
                traits: {
                    "Type": data.ruleSet[i].rule.type.toLowerCase(),
                    ...data.ruleSet[i].ruleCharacteristics
                },
                tables: {
                    indicesOfCoveredObjects: data.ruleSet[i].indicesOfCoveredObjects.slice(),
                },
                toFilter() {
                    return [
                        this.name.decisionsToString().toLowerCase(),
                        ...this.name.conditions.map(condition => {
                            return condition.toString().toLowerCase()
                        })
                    ]
                }
            });
        }
    }

    return items;
}

export default parseRulesItems

