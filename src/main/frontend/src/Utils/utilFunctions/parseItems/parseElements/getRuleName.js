import parseConditions from "./parseConditions";
import parseDecisions from "./parseDecisions";

/**
 * <h3>Overview</h3>
 * Generates name for rules. Uses {@link parseDecisions} and {@link parseDecisions} to obtain decisions and conditions.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} rule - A single rule from a rule set.
 * @returns {Object} - Generated name for provided rule.
 */
function getRuleName(rule) {
    return {
        decisions: parseDecisions(rule.decisions),
        conditions: parseConditions(rule.conditions),
        decisionsToString() {
            return this.decisions.map(and => {
                return and.map(decision => {
                    if (and.length > 1) {
                        return decision.withBraces();
                    } else {
                        return decision.toString();
                    }
                }).join(" \u2227 ");
            }).join(" \u2228 ");
        },
        conditionsToString() {
            return this.conditions.map(condition => {
                if (this.conditions.length > 1) {
                    return condition.withBraces();
                } else {
                    return condition.toString();
                }
            }).join(" \u2227 ")
        },
        toString() {
            return this.decisionsToString() + " \u2190 " + this.conditionsToString();
        }
    }
}

export default getRuleName;
