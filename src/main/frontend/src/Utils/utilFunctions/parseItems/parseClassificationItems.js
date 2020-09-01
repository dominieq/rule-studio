import { getItemName } from "./parseElements";

/**
 * Converts server response to an array of items. Single item can be displayed in {@link ClassifiedObjectDialog}.
 * Uses {@link getItemName} as well as 'settings' to obtain special name for an item.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} data - Server response.
 * @param {Object} settings - Project settings.
 * @returns {Object[]} - An array of items.
 */
function parseClassificationItems(data, settings) {
    let items = [];

    if (data && Object.keys(data).length) {
        for (let i = 0; i < data.classificationResults.length; i++) {
            items.push({
                id: i,
                name: getItemName(i, data.informationTable.objects, settings),
                traits: {
                    ...data.informationTable,
                    ...data.classificationResults[i],
                    originalDecision: data.originalDecisions[i],
                },
                tables: {
                    indicesOfCoveringRules: data.indicesOfCoveringRules[i].slice()
                },
                toFilter() {
                    return [
                        this.name.toString().toLowerCase(),
                        "original decision " + this.traits.originalDecision,
                        "suggested decision " + this.traits.suggestedDecision,
                        "certainty " + this.traits.certainty,
                        "covered by " + this.tables.indicesOfCoveringRules.length + " rules"
                    ]
                }
            });
        }
    }

    return items;
}

export default parseClassificationItems;
