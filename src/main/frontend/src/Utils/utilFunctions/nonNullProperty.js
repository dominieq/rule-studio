/**
 * <h3>Overview</h3>
 * Checks whether object exists, has it's own property from second argument and that property has a defined value.
 *
 * @param {Object} object - Any javascript object.
 * @param {string} propertyName - The property name as string.
 * @returns {boolean} - If <code>true</code> the object has a non null property.
 */
function nonNullProperty(object, propertyName) {
    return object != null && object.hasOwnProperty(propertyName) && object[propertyName] != null;
}

export default nonNullProperty;
