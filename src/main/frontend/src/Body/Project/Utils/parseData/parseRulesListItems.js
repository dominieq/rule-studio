const getFixed = (number) => {

    if (Number.isInteger(Number(number))) {
        return Number(number);
    } else {
        let result = Number(number).toFixed(3);

        if (Number.isInteger(Number(result))) {
            return Number(number).toExponential(3);
        } else {
            return Number(result);
        }
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