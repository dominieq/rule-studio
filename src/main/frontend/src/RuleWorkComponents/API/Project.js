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
        this.settings = {
            indexOption: "default",
        };
        this.dataUpToDate = true;
        this.tabsUpToDate = Array(5.).fill(true);
        this.dataHistory = {
            historySnapshot: 0,
            history: []
        };
    }
}

export default Project