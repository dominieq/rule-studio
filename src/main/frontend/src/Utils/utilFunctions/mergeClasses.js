import clsx from "clsx";

/**
 * <h3>Overview</h3>
 * Merges two classes objects.
 * Classes object looks something like this: <code>{key-name: "name-of-css_class"}</code>.
 * <br>
 * For more information check out Material-UI docs on
 * <a href="https://material-ui.com/customization/components/#overriding-styles-with-classes" target="_blank">
 *     overriding styles with classes
 * </a>.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} c1 - Base classes object. Some values may be overwritten.
 * @param {Object} c2 - Classes object that will be merged into base classes object.
 * @returns {Object} - Merged classes object.
 */
function mergeClasses(c1, c2) {
    return {
        ...c1,
        ...Object.keys(c2).map(key => {
            if (Object.keys(c1).includes(key)) {
                return {[key]: clsx(c1[key], c2[key])};
            } else {
                return {...c2[key]};
            }
        }).reduce((previousValue, currentValue) => {
            return { ...previousValue, ...currentValue };
        })
    };
}

export default mergeClasses;
