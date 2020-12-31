import compareValues from "./compareValues";

/**
 * <h3>Overview</h3>
 * Sorts an array of given objects by category in given order.
 * Uses {@link compareValues} to compare objects.
 *
 * @memberOf SortMenu
 * @param {Object[]} objects - The array of objects that is going to be sorted.
 * @param {string} category - The name of a property to sort by.
 * @param {"asc"|"desc"} order - The order of sorting.
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
