const getFixed = (number) => {
    let result = Number(number).toFixed(3);

    if (Number(result) * 2 === result * 2) {
        result = Number(result);
    }

    return result;
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
                    ` (Strength: ${getFixed(items[i].traits["Strength"])},` +
                    ` Confidence: ${getFixed(items[i].traits["Confidence"])},` +
                    ` Coverage factor: ${getFixed(items[i].traits["CoverageFactor"])},` +
                    ` Epsilon measure: ${getFixed(items[i].traits["EpsilonMeasure"])})`,
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