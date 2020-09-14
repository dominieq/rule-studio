import { getRuleName } from "./parseElements";

/**
 * Converts server response to an array of items. Single item can be displayed in {@link RulesDialog}.
 * Uses {@link getRuleName} to obtain special name for an item.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} data - Server response.
 * @returns {Object[]} - An array of items.
 */
function parseRulesItems(data) {
    let items = [];

    if (data && Object.keys(data).includes("ruleSet")) {
        for (let i = 0; i < data.ruleSet.length; i++) {
            items.push({
                id: i,
                name: getRuleName(data.ruleSet[i].rule),
                traits: {
                    "Type": data.ruleSet[i].rule.type.toLowerCase(),
                    ...data.ruleSet[i].ruleCharacteristics
                },
                tables: {
                    indicesOfCoveredObjects: Array.isArray(data.ruleSet[i].indicesOfCoveredObjects) ?
                        data.ruleSet[i].indicesOfCoveredObjects.slice() : [],
                    isSupportingObject: Array.isArray(data.ruleSet[i].isSupportingObject) ?
                        data.ruleSet[i].isSupportingObject.slice() : []
                },
                toFilter() {
                    return [
                        this.name.decisionsToString().toLowerCase(),
                        ...this.name.conditions.map(condition => {
                            return condition.toString().toLowerCase()
                        }),
                        "support " + this.traits["Support"],
                        "strength " + this.traits["Strength"],
                        "confidence " + this.traits["Confidence"],
                        "coverage factor " + this.traits["Coverage factor"],
                        "epsilon measure " + this.traits["Epsilon measure"],
                        "rule " + (this.id + 1)
                    ]
                },
                toSort(category) {
                    if (category === "id") {
                        return {
                            id: this.id
                        }
                    }else if (this.traits.hasOwnProperty(category)) {
                        return {
                            id: this.id,
                            [category]: this.traits[category]
                        };
                    } else {
                        return null;
                    }
                }
            });
        }
    }

    return items;
}

export default parseRulesItems
