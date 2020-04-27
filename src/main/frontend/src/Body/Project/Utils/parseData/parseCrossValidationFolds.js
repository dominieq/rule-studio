function parseCrossValidationFolds(data) {
    let folds = [];
    if (data && Object.keys(data).length) {
        for (let i = 0; i < data.numberOfFolds; i++) {
            folds.push({
                index: i,
                numberOfTestObjects: data.crossValidationSingleFolds[i].validationTable.objects.length,
                ...data.crossValidationSingleFolds[i]
            });
        }
    }
    return folds;
}

export default parseCrossValidationFolds;