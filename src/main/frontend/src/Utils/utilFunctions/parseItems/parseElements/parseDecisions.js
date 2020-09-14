import { getRelationSign } from "../parseDetails";

/**
 * Converts decisions from server response to decisions used in a rule name.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object[][]} decisions - Decision from a single rule received from server.
 * @returns {Object[][]} - An array of decisions.
 */
function parseDecisions(decisions) {
    let parsedAll = [];

    if (Array.isArray(decisions) && decisions.length) {
        for (let i = 0; i < decisions.length; i++) {
            let parsedPart = [];

            for (let j = 0; j < decisions[i].length; j++) {
                parsedPart.push({
                    primary: decisions[i][j].attributeName,
                    secondary: getRelationSign(decisions[i][j].relationSymbol) + " " + decisions[i][j].limitingEvaluation,
                    toString() {
                        return this.primary + " " + this.secondary;
                    },
                    withBraces() {
                        return "(" + this.primary + " " + this.secondary + ")"
                    }
                });
            }

            parsedAll.push(parsedPart);
        }
    }
    return parsedAll;
}

export default parseDecisions;
