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

    if (data != null && data.hasOwnProperty("numberOfObjects")) {
        for (let i = 0; i < data.numberOfObjects; i++) {
            items.push({
                id: i,
                name: getItemName(i, objects, settings),
                traits: {
                    ...(data.hasOwnProperty("positiveDominanceCones")
                        && { 'Positive dominance cone': data.positiveDominanceCones[i] }),
                    ...(data.hasOwnProperty("negativeDominanceCones")
                        && { 'Negative dominance cone': data.negativeDominanceCones[i] }),
                    ...(data.hasOwnProperty("positiveInverseDominanceCones")
                        && { 'Positive inverse dominance cone': data.positiveInverseDominanceCones[i] }),
                    ...(data.hasOwnProperty("negativeInverseDominanceCones")
                        && { 'Negative inverse dominance cone': data.negativeInverseDominanceCones[i]})
                },
                toFilter() {
                    return [
                        this.name.toString().toLowerCase(),
                        ...Object.keys(this.traits).map(key => {
                            return key.toLowerCase() + " " + this.traits[key]
                        }),
                    ]
                }
            });
        }
    }

    return items;
}

export default parseConesItems;
