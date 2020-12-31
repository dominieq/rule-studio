/**
 * <h3>Overview</h3>
 * Returns a unicode for a provided relation symbol.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} relationSymbol - A relation symbol as a simple string.
 * @returns {string} - A relation in unicode.
 */
function getRelationSign(relationSymbol) {
    switch (relationSymbol) {
        case "<=": return "\u2264";
        case ">=": return "\u2265";
        default: return relationSymbol;
    }
}

export default getRelationSign;
