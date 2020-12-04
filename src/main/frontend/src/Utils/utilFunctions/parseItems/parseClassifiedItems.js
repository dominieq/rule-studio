import { getItemName } from "./parseElements";

/**
 * Converts server response to an array of items. Single item can be displayed in {@link ClassifiedObjectDialog}.
 * Uses {@link getItemName} as well as 'settings' to obtain special name for an item.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Array} objects - The array of classified objects received from server.
 * @param {Array} names - The array of object names received from server.
 * @returns {Object[]} - The array of items.
 */
function parseClassifiedItems(objects, names) {
    let items = [];

    if (Array.isArray(objects) && objects.length > 0) {
        for (let i = 0; i < objects.length; i++) {
            items.push({
                id: i,
                name: getItemName(i, names),
                traits: { ...objects[i] },
                toFilter() {
                    return [
                        this.name.toString().toLowerCase(),
                        "original decision " + this.traits.originalDecision,
                        "suggested decision " + this.traits.suggestedDecision,
                        "certainty " + this.traits.certainty,
                        "covered by " + this.traits.numberOfCoveringRules + " rules"
                    ]
                }
            });
        }
    }

    return items;
}

export default parseClassifiedItems;
