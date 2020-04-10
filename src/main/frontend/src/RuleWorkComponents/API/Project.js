class Project {
    constructor(result) {
        this.result = result;

        this.parameters = {
            consistencyThreshold: 0,
            defaultClassificationResult: "majorityDecisionClass",
            numberOfFolds: 2,
            typeOfClassifier: "SimpleRuleClassifier",
            typeOfRules: "certain",
            typeOfUnions: "monotonic"
        };

        this.parametersSaved = true;

        this.threshold = 0.0;
        this.typeOfUnions = "monotonic";
        this.typeOfClassifier = "SimpleRuleClassifier";
        this.defaultClassificationResult = "majorityDecisionClass";
        this.ruleType = "certain";
        this.foldIndex = 0;
        this.foldNumber = 2;

        this.externalRules = false;
        this.dataUpToDate = true;
        this.tabsUpToDate = Array(5.).fill(true);
        this.settings = {
            indexOption: "default",
        };
        this.dataHistory = {
            historySnapshot: 0,
            history: []
        };
    }
}

export default Project