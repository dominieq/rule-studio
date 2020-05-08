import { getItemName } from "./utilFunctions";

function parseCrossValidationItems(fold, settings) {
    let items = [];

    if (fold && Object.keys(fold).length) {
        for (let i = 0; i < fold.validationTable.objects.length; i++) {
            items.push({
                id: i,
                name: getItemName(i, fold.validationTable.objects, settings),
                traits: {
                    ...fold.validationTable,
                    ...fold.classificationValidationTable.classificationResults[i],
                    originalDecision: fold.classificationValidationTable.originalDecisions[i]
                },
                tables: {
                    indicesOfCoveringRules: fold.classificationValidationTable.indicesOfCoveringRules[i],
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

export default parseCrossValidationItems;
