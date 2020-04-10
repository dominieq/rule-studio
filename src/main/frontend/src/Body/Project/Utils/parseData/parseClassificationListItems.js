function parseClassificationListItems(items) {
    let listItems = [];

    if (Array.isArray(items) && items.length) {
        for (let i = 0; i < items.length; i++) {
            const listItem = {
                id: items[i].id,
                header: items[i].name.toString(),
                subheader: "Suggested decision: " + items[i].traits.suggestedDecision,
                content: "Is covered by " + items[i].tables.indicesOfCoveringRules.length + " rules"
            };
            listItems.push(listItem)
        }
    }

    return listItems;
}

export default parseClassificationListItems;