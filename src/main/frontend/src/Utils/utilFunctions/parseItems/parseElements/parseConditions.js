import { getRelationSign } from "../parseDetails";

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
