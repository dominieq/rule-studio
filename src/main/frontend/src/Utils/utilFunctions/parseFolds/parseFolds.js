function parseFolds(data) {
    let folds = [];

    if (data && Object.keys(data).length) {
        for (let i = 0; i < data.numberOfFolds; i++) {
            folds.push({
                index: i,
                numberOfLearningObjects: data.crossValidationSingleFolds[i].trainingTable.objects.length,
                numberOfTestObjects: data.crossValidationSingleFolds[i].validationTable.objects.length,
                ...data.crossValidationSingleFolds[i]
            });
        }
    }

    return folds;
}

export default parseFolds;
