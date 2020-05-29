function parseCrossValidationParams(result) {
    return Object.keys(result).map(key => {
        if (typeof result[key] !== 'object') {

            if (typeof result[key] === 'number') {

                return { [key]: result[key] }
            } else if (typeof result[key] === 'string') {

                let param = result[key].split("_").map(text => {
                    return text[0] + text.slice(1).toLowerCase();
                }).join("");

                if (key !== 'typeOfClassifier') {
                    return  { [key]: param[0].toLowerCase() + param.slice(1) };
                } else {
                    return { [key]: param };
                }
            } else {
                return {};
            }
        } else {
            return {};
        }
    }).reduce((previousValue, currentValue) => {
        return { ...previousValue, ...currentValue};
    });
}

export default parseCrossValidationParams;
