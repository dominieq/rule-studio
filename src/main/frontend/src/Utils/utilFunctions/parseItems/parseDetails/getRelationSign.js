function getRelationSign(relationSymbol) {
    switch (relationSymbol) {
        case "<=": return "\u2264";
        case ">=": return "\u2265";
        default: return relationSymbol;
    }
}

export default getRelationSign;
