/**
 * Generates name for items displayed in {@link Cones}, {@link Classification} and {@link CrossValidation}.
 * Function takes user preferences into account. If an 'indexOption' property from project settings is equal to one of
 * description or identification attributes, a value associated with this attribute will be used as a name.
 * <br>
 * <br>
 * Used to generate name for {@link parseConesItems}, {@link parseClassificationItems} and {@link parseCrossValidationItems}.
 *
 * @category Utils
 * @subcategory Functions
 * @param index - The id of an object.
 * @param objects - The 'objects' array from information table.
 * @param settings - The project settings.
 * @param [defaultName = "Object"] - If 'indexOption' from settings is 'default', this value will be used as name's prefix.
 * @returns {Object} - An item's name.
 */
function getItemName(index, objects, settings, defaultName = "Object") {
    let name = {
        primary: defaultName,
        secondary: index + 1,
        toString() {
            return this.primary + " " + this.secondary;
        }
    };

    if (settings != null && objects != null && objects[index] != null) {
        if (settings.hasOwnProperty("indexOption") && settings.indexOption !== "default"
            && objects[index].hasOwnProperty(settings.indexOption)) {

            name = {
                secondary: objects[index][settings.indexOption],
                toString() {
                    return this.secondary;
                }
            };
        }
    } else {
        // TODO throw error
    }

    return name;
}

export default getItemName;
