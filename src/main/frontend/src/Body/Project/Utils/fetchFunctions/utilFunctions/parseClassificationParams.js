function parseClassificationParams(result) {
    return Object.keys(result).map(key => {
        if (typeof result[key] === "string") {
            let param = result[key].split("_");
            param = param.map(text => {
                return text[0] + text.slice(1).toLowerCase();
            }).join("");

            if (key === "defaultClassificationResult") {
                return { [key]: param[0].toLowerCase() + param.slice(1) };
            } else {
                return { [key]: param };
            }
        }
    }).reduce((previousValue, currentValue) => {
        return { ...previousValue, ...currentValue }
    });
}

export default parseClassificationParams;