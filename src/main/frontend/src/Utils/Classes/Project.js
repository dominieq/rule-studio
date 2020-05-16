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
                value: ""
            }
        };

        this.foldIndex = 0;

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