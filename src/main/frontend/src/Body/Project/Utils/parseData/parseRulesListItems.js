const getFixed = (value) => {
    if (Number(value)) {
        if (Number.isInteger(Number(value))) {
            return Number(value);
        } else {
            let result = Number(value).toFixed(3);

            if (Number.isInteger(Number(result))) {
                return Number(value).toExponential(3);
            } else {
                return Number(result);
            }
        }
    } else {
        return value;
    }
};

function parseRulesListItems(items) {
    let listItems = [];

    if (Array.isArray(items) && items.length) {
        for (let i = 0; i < items.length; i++) {
            listItems.push({
                id: items[i].id,
                header: items[i].name.decisionsToString(),
                subheader: "Type: " + items[i].traits["Type"],
                content: "Support: " + items[i].traits["Support"] +
                    ` | Strength: ${getFixed(items[i].traits["Strength"])}` +
                    ` | Coverage factor: ${getFixed(items[i].traits["Coverage factor"])}` +
                    ` | Confidence: ${getFixed(items[i].traits["Confidence"])}` +
                    ` | Epsilon measure: ${getFixed(items[i].traits["Epsilon measure"])}`,
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