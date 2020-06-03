import { modifyRules } from "./parseElements";

function parseFolds(data) {
    let folds = [];

    if (data && Object.keys(data).length) {
        for (let i = 0; i < data.numberOfFolds; i++) {
            folds.push({
                index: i,
                numberOfLearningObjects: data.crossValidationSingleFolds[i].indicesOfTrainingObjects.length,
                numberOfTestObjects: data.crossValidationSingleFolds[i].indicesOfValidationObjects.length,
                classificationValidationTable: data.crossValidationSingleFolds[i].classificationValidationTable,
                indicesOfTrainingObjects: data.crossValidationSingleFolds[i].indicesOfTrainingObjects,
                indicesOfValidationObjects: data.crossValidationSingleFolds[i].indicesOfValidationObjects,
                ruleSet: modifyRules(
                    data.crossValidationSingleFolds[i].ruleSet,
                    data.crossValidationSingleFolds[i].indicesOfTrainingObjects
                ),
            });
        }
    }

    return folds;
}

export default parseFolds;
