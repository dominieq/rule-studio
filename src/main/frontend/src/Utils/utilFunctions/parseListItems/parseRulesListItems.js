/**
 * Formats number using either a fixed-point notation or an exponential notation.
 * The exponential notation is used if there are three or more zero digits after decimal point
 * and before a non-zero digit.
 * Otherwise, a fixed-point notation is used.
 * <br>
 * <br>
 * If a provided value is an integer, formatting is omitted.
 * <br>
 * <br>
 * Used in {@link parseRulesListItems} to prepare rule characteristic to be displayed in {@link ResultList}.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string|number} value - A number that will be formatted accordingly.
 * @returns {string|number} - A formatted number.
 */
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

/**
 * Converts items to list items that will be displayed in {@link ResultList}.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object[]} items - An array of items prepared by {@link parseRulesItems}.
 * @returns {Object[]} - An array of list items displayed in {@link ResultList}.
 */
function parseRulesListItems(items) {
    let listItems = [];

    if (Array.isArray(items) && items.length) {
        for (let i = 0; i < items.length; i++) {
            listItems.push({
                id: items[i].id,
                header: items[i].name.decisionsToString(),
                subheader: `Rule ${items[i].id + 1}`,
                caption: `Support: ${items[i].traits["Support"]}` +
                    ` | Strength: ${getFixed(items[i].traits["Strength"])}` +
                    ` | Coverage factor: ${getFixed(items[i].traits["Coverage factor"])}` +
                    ` | Confidence: ${getFixed(items[i].traits["Confidence"])}` +
                    ` | Epsilon measure: ${getFixed(items[i].traits["Epsilon measure"])}`,
                subcaption: `Type: ${items[i].traits["Type"]}`,
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
