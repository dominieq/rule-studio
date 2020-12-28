import { getRelationSign } from "../../../Utils/utilFunctions/parseItems/parseDetails";

const relationSigns = ["<=", ">="];

/**
 * <h3>Overview</h3>
 * Looks for at least one match in filter features.
 * When filterText contains more than one word, all of them have to be found in at least one filter feature.
 *
 * @function
 * @category Project
 * @subcategory Filtering
 * @param {string} filterText - Input from {@link FilterTextField}.
 * @param {Object[]} items - The list of items from {@link ResultList}.
 * @returns {Object[]} - Filtered list of items.
 */
const filterFunction = (filterText, items) => {
    if (filterText === "") {
        return items;
    } else {
        let filters = filterText.toString().toLowerCase().split(" ");

        let displayedItems = [];
        for (let i = 0; i < items.length; i++) {
            const object = {...items[i]};
            let objectFeatures = object.toFilter();

            let matchAll = false;
            for (let j = 0; j < objectFeatures.length; j++) {
                let match = true
                for  (let k = 0; k < filters.length; k++) {
                    if (relationSigns.includes(filters[k])) {
                        filters[k] = getRelationSign(filters[k]);
                    }

                    if(!objectFeatures[j].includes(filters[k])) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    matchAll = true;
                    break;
                }
            }
            if (matchAll) {
                displayedItems = [...displayedItems, object];
            }
        }
        if (displayedItems.length > 0) {
            return displayedItems;
        } else {
            return null;
        }
    }
};

export default filterFunction;
