import { getItemName } from "./parseElements";

/**
 * Converts server response to an array of items. Single item can be displayed in {@link ConesDialog}.
 * Uses {@link getItemName} as well as 'objects' and 'settings' to obtain special name for an item.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} data - Server response.
 * @param {Object[]} objects - An 'objects' array from information table obtained from current project.
 * @param {Object} settings - Project settings.
 * @returns {Object[]} - An array of items.
 */
function parseConesItems(data, objects, settings) {
    let items = [];

    if (data && Object.keys(data).length) {
        for (let i = 0; i < data.numberOfObjects; i++) {
            items.push({
                id: i,
                name: getItemName(i, objects, settings),
                tables: Object.keys(data).map(key => {
                    if (Array.isArray(data[key])) {
                        return {
                            [key]: data[key][i].slice()
                        }
                    } else {
                        return {};
                    }
                }).reduce((previous, current) => {
                    return {...previous, ...current}
                }),
                toFilter() {
                    return [
                        this.name.toString().toLowerCase(),
                        ...Object.keys(this.tables).map(key => {
                            return key.toLowerCase() + " " + this.tables[key].length
                        }),
                    ]
                }
            });
        }
    }

    return items;
}

export default parseConesItems;
