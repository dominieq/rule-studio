/**
 * Generates name for items displayed in {@link Cones}, {@link Classification} and {@link CrossValidation}.
 * Function takes user preferences into account. If an 'indexOption' property from project settings is equal to one of
 * description or identification attributes, a value associated with this attribute will be used as a name.
 * <br>
 * <br>
 * Used to generate name for {@link parseConesItems}, {@link parseClassifiedItems}.
 *
 * @category Utils
 * @subcategory Functions
 * @param index - The index of an object in information table.
 * @param names - The array of object names received from server.
 * @param [defaultName = "Object"] - The default object name.
 * @returns {Object} - An item's name as an object.
 */
function getItemName(index, names, defaultName = "Object") {
    if (names != null && Array.isArray(names)) {
        if (names[index] !== defaultName + " " + index) {
            return {
                secondary: names[index],
                toString() {
                    return this.secondary;
                }
            }
        }
    }

    return {
        primary: defaultName,
        secondary: index + 1,
        toString() {
            return this.primary + " " + this.secondary;
        }
    }
}

export default getItemName;
