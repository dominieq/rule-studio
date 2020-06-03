function modifyRuleSet(ruleSet, indices) {
    let newRuleSet = [];

    if (Array.isArray(ruleSet) && ruleSet.length) {
        newRuleSet = JSON.parse(JSON.stringify(ruleSet));

        for (let i = 0; i < newRuleSet.length; i++) {
            for (let j = 0; j < newRuleSet[i].indicesOfCoveredObjects.length; j++) {
                newRuleSet[i].indicesOfCoveredObjects[j] = indices[newRuleSet[i].indicesOfCoveredObjects[j]];
            }
        }
    }

    return ruleSet;
}

export default modifyRuleSet;
