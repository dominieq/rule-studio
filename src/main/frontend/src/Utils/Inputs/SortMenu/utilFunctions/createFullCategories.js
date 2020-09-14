/**
 * Creates an array of "label-value" pairs that represent categories used to sort given data set.
 * Values should be unique. Labels don't have this restriction.
 *
 * @memberOf Sort Menu
 * @param labels {string[]} - The array of labels used to sort a given set of data.
 * @param values {string[]} - The array of values associated with <code>label</code>.
 * @param [noneLabel="none"] {string} - The label used to reset filtration.
 * @param [noneValue=""] {string} - The value associated with <code>noneLabel</code>.
 * @returns {Object[]} - The array of categories.
 */
function createFullCategories(labels, values, noneLabel = "none", noneValue = "") {
    if (labels.length === values.length) {
        let categories = [];

        for (let i = 0; i < values.length; i++) {
            categories.push({
                label: labels[i].toLowerCase(),
                value: values[i]
            });
        }

        categories.unshift({
            label: noneLabel,
            value: noneValue
        });

        return categories;
    } else {
        return [];
    }
}

export default createFullCategories;
