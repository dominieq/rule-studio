/**
 * The Project is a main entity in RuLeStudio application. It contains uploaded data (attributes and objects)
 * as well as results from calculations. Apart from that it also stores parameters that are used in calculations.
 * User settings are also stored inside project.
 *
 * @constructor
 * @category Utils
 * @subcategory Classes
 * @param {string} id - The identifier of a project.
 * @param {string} name - The name of a project.
 */
class Project {
    constructor(id, name) {
        this.id = id;
        this.name = name;

        this.parameters = {
            consistencyThreshold: 0,
            defaultClassificationResultType: "majorityDecisionClass",
            numberOfFolds: 10,
            seed: 0,
            classifierType: "SimpleRuleClassifier",
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

        this.dataHistory = {
            historySnapshot: 0,
            history: []
        };
        this.isDataFromServer = true;
    }
}

export default Project
