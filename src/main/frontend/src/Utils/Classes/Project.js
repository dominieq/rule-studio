/**
 * The Project is a main entity in RuLeStudio application. It contains uploaded data (attributes and objects)
 * as well as results from calculations. Apart from that it also stores parameters that are used in calculations.
 * User settings are also stored inside project.
 *
 * @constructor
 * @param {Object} result An object received from server with data and calculation results.
 */
class Project {
    constructor(result) {
        this.result = result;

        this.parameters = {
            consistencyThreshold: 0,
            defaultClassificationResult: "majorityDecisionClass",
            numberOfFolds: 10,
            seed: 0,
            typeOfClassifier: "SimpleRuleClassifier",
            typeOfRules: "certain",
            typeOfUnions: "monotonic"
        };
        this.parametersSaved = true;

        this.sortParams = {
            rules: {
                order: "asc",
                value: "id"
            }
        };

        this.foldIndex = 0;
        this.classifyAction = 0;

        this.settings = {
            indexOption: "default",
        };

        this.dataHistory = {
            historySnapshot: 0,
            history: []
        };
        this.isDataFromServer = true;
    }
}

export default Project
