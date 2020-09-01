import { getRelationSign } from "../parseDetails";

/**
 * Converts conditions from server response to conditions used in a rule name.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object[][]} conditions - Conditions from a single rule received from server.
 * @returns {Object[][]} - An array of conditions.
 */
function parseConditions(conditions) {
    let parsed = [];

    if (Array.isArray(conditions) && conditions.length) {
        for (let i = 0; i < conditions.length; i++) {
            parsed.push({
                primary: conditions[i].attributeName,
                secondary: getRelationSign(conditions[i].relationSymbol) + " " + conditions[i].limitingEvaluation,
                toString() {
                    return this.primary + " " + this.secondary;
                },
                withBraces() {
                    return "(" + this.primary + " " + this.secondary + ")";
                }
            });
        }
    }

    return parsed;
}

export default parseConditions;
