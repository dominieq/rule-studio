class Project {
    constructor(result) {
        this.result = result;
        this.externalRules = false;
        this.threshold = 0.0;
        this.measure = "epsilon";
        this.ruleType = "certain";
        this.foldDisplay = 0;
        this.foldIndex = 0;
        this.foldNumber = 1;
    }
}

export default Project