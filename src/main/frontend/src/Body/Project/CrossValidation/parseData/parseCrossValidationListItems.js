function parseCrossValidationListItems(items) {
    let listItems = [];
    if (Array.isArray(items) && items.length) {
        for ( let i = 0; i < items.length; i++) {
            listItems.push({
                id: items[i].id,
                header: items[i].name,
                subheader: "Suggested decision " + items[i].traits.suggestedDecision,
                content: "Covered by " + items[i].tables.indicesOfCoveringRules.length + " rules"
            });
        }
    }
    return listItems;
}

export default parseCrossValidationListItems;