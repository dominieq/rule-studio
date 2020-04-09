function parseRulesListItems(items) {
    let listItems = [];

    if (Array.isArray(items) && items.length) {
        for (let i = 0; i < items.length; i++) {
            listItems.push({
                id: items[i].id,
                header: items[i].name.decisions.map(and => {
                    return and.map(decision => {
                        if (and.length > 1) {
                            return decision.withBraces();
                        } else {
                            return decision.toString();
                        }
                    }).join(" \u2227 ");
                }).join(" \u2228 "),
                subheader: "Type: " + items[i].traits["Type"],
                content: "Support: " + items[i].traits["Support"] + ` (with strength ${items[i].traits["Strength"]})`,
                multiContent: items[i].name.conditions.map(condition => (
                    {
                        title: condition.primary,
                        subtitle: condition.secondary,
                    }
                )),
            });
        }
    }

    return listItems;
}

export default parseRulesListItems;