/**
 * Retrieves folds from cross-validation results received from server.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} data - Server response.
 * @returns {Object[]} - Parsed folds.
 */
function parseFolds(data) {
    let folds = [];

    if (data && Object.keys(data).length) {
        for (let i = 0; i < data.numberOfFolds; i++) {
            folds.push({
                index: i,
                numberOfLearningObjects: data.crossValidationSingleFolds[i].indicesOfTrainingObjects.length,
                numberOfTestObjects: data.crossValidationSingleFolds[i].indicesOfValidationObjects.length,
                ...data.crossValidationSingleFolds[i],
            });
        }
    }

    return folds;
}

export default parseFolds;
