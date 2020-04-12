import { getItemName } from "./utilFunctions";

function parseClassificationItems(data, settings) {
    let items = [];

    if (data && Object.keys(data).length) {
        for (let i = 0; i < data.classificationResults.length; i++) {
            items.push({
                id: i,
                name: getItemName(i, data.informationTable.objects, settings),
                traits: {
                    attributes: data.informationTable.attributes.slice(),
                    objects: data.informationTable.objects.slice(),
                    suggestedDecision: data.classificationResults[i].suggestedDecision
                },
                tables: {
                    indicesOfCoveringRules: data.indicesOfCoveringRules[i].slice()
                }
            });
        }
    }

    return items;
}

export default parseClassificationItems;
