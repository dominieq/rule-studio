function parseRulesParams(result) {
    return Object.keys(result).map(key => {
        if (key !== "ruleSet") {
            let value =  typeof result[key] === 'string' ? result[key].toLowerCase() : result[key];
            return { [key]:  value };
        }
    }).reduce((previousValue, currentValue) => {
        return { ...previousValue, ...currentValue}
    });
}

export default parseRulesParams;