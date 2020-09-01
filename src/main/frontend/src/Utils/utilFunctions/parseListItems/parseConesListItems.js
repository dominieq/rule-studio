/**
 * Converts items to list items that will be displayed in {@link ResultList}.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object[]} items - An array of items prepared by {@link parseConesItems}.
 * @returns {Object[]} - An array of list items displayed in {@link ResultList}.
 */
function parseConesListItems(items) {
    let listItems = [];

    if (Array.isArray(items) && items.length) {
        for (let i = 0; i < items.length; i++) {
            listItems.push({
                id: items[i].id,
                header: items[i].name.toString(),
                subheader: undefined,
                content: undefined,
                multiContent: Object.keys(items[i].tables).map(key => {
                    return {
                        title: `Number of objects in ${key.toLowerCase()}:`,
                        subtitle: items[i].tables[key].length
                    }
                })
            });
        }
    }

    return listItems;
}

export default parseConesListItems;
