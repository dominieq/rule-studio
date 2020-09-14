import { getItemName } from "./parseElements";

/**
 * Converts objects from a provided fold to an array of items.
 * Single item can be displayed in {@link ClassifiedObjectDialog}.
 * Uses {@link getItemName} as well as 'settings' to obtain special name for an item.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} dataInformationTable - Information table from cross-validation server response.
 * @param {Object} fold - An object obtained from {@link parseFolds}.
 * @param {Object} settings - Project settings.
 * @returns {Object[]} - An array of items.
 */
function parseCrossValidationItems(dataInformationTable, fold, settings) {
    let items = [];

    if (fold && Object.keys(fold).length) {
        const indices = [ ...fold.indicesOfValidationObjects ];

        for (let i = 0; i < indices.length; i++) {
            items.push({
                id: i,
                name: getItemName(indices[i], dataInformationTable.objects, settings),
                traits: {
                    attributes: dataInformationTable.attributes,
                    objects: indices.map(value => dataInformationTable.objects[value]),
                    ...fold.classificationValidationTable.classificationResults[i],
                    originalDecision: fold.classificationValidationTable.originalDecisions[i]
                },
                tables: {
                    indicesOfCoveringRules: fold.classificationValidationTable.indicesOfCoveringRules[i]
                },
                toFilter() {
                    return [
                        this.name.toString().toLowerCase(),
                        "original decision " + this.traits.originalDecision,
                        "suggested decision " + this.traits.suggestedDecision,
                        "certainty " + this.traits.certainty,
                        "covered by " + this.tables.indicesOfCoveringRules.length + " rules"
                    ];
                }
            });
        }
    }

    return items;
}

export default parseCrossValidationItems;
