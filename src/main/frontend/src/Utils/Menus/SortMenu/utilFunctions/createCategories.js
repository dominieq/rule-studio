import createFullCategories from "./createFullCategories";

/**
 * Creates categories where labels and values are the same.
 *
 * @memberOf SortMenu
 * @param categories {string[]} - The array of strings that will be used as labels and values.
 * @param [noneLabel="none"] {string} - The label used to reset filtration.
 * @param [noneValue=""] {string} - The value associated with <code>noneLabel</code>.
 * @returns {Object[]} - The array of categories.
 */
function createCategories(categories, noneLabel = "none", noneValue = "") {
    return createFullCategories(categories, categories, noneLabel, noneValue);
}

export default createCategories;
