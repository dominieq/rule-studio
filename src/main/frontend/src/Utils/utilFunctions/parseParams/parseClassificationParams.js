/**
 * Retrieves parameters used to perform classification from server response.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} result - Server response.
 * @returns {Object} - Retrieved parameters.
 */
function parseClassificationParams(result) {
    return Object.keys(result).map(key => {
        if (typeof result[key] === "string") {

            let param = result[key].split("_");
            param = param.map(text => {
                return text[0] + text.slice(1).toLowerCase();
            }).join("");

            if (key === "defaultClassificationResultType") {
                return { [key]: param[0].toLowerCase() + param.slice(1) };
            } else {
                return { [key]: param };
            }
        } else {
            return {};
        }
    }).reduce((previousValue, currentValue) => {
        return { ...previousValue, ...currentValue }
    });
}

export default parseClassificationParams;
