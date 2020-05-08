import { conjugateContent } from "./utilFunctions";

function parseCrossValidationListItems(items) {
    let listItems = [];

    if (Array.isArray(items) && items.length) {
        for (let i = 0; i < items.length; i++) {
            listItems.push({
                id: items[i].id,
                header: items[i].name.toString(),
                subheader: "Covered by " + conjugateContent(items[i].tables.indicesOfCoveringRules.length, "rule"),
                multiContent: [
                    {
                        title: "Original decision:",
                        subtitle: items[i].traits.originalDecision
                    },
                    {
                        title: "Suggested decision:",
                        subtitle: items[i].traits.suggestedDecision
                    },
                    {
                        title: "Certainty:",
                        subtitle: items[i].traits.certainty
                    }
                ]
            });
        }
    }

    return listItems;
}

export default parseCrossValidationListItems;