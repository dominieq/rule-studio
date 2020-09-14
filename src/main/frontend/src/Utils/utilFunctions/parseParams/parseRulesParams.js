/**
 * Retrieves parameters used to generate rules from server response.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} result - Server response.
 * @returns {Object} - Retrieved parameters.
 */
function parseRulesParams(result) {
    return Object.keys(result).map(key => {
        if (key !== "ruleSet") {
            let value =  typeof result[key] === 'string' ? result[key].toLowerCase() : result[key];
            return { [key]:  value };
        } else {
            return {};
        }
    }).reduce((previousValue, currentValue) => {
        return { ...previousValue, ...currentValue}
    });
}

export default parseRulesParams;
