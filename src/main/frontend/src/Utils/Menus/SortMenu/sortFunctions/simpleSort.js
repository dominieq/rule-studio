import compareValues from "./compareValues";

/**
 * Sorts an array of given objects by category in given order.
 * Uses {@link compareValues} to compare objects.
 *
 * @memberOf SortMenu
 * @param objects {Object[]} - The array of objects that is going to be sorted.
 * @param category {string} - The name of a property to sort by.
 * @param order {"asc"|"desc"} - The order of sorting.
 * @returns {Object[]} - Sorted array of objects.
 */
function simpleSort(objects, category, order) {
    if (Array.isArray(objects)) {
        return objects.slice().sort(compareValues(category, order));
    } else {
        return null;
    }
}

export default simpleSort;
