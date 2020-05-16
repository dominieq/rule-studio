package pl.put.poznan.rulestudio.model;

public class ValidityRulesContainer {
    private Boolean unions;
    private Boolean rulesExternal;
    private Boolean rulesData;
    private Boolean classificationExternal;
    private Boolean classificationLearningData;
    private Boolean classificationRules;

    public ValidityRulesContainer(Project project) {
        UnionsWithHttpParameters unions = project.getUnions();
        if(unions != null) {
            this.unions = project.getUnions().isCurrentData();
        }

        RulesWithHttpParameters rules = project.getRules();
        if(rules != null) {
            this.rulesExternal = project.getRules().isExternalRules();
            this.rulesData = project.getRules().isCurrentData();
        }

        Classification classification = project.getClassification();
        if(classification != null) {
            this.classificationExternal = project.getClassification().isExternalData();
            this.classificationLearningData = project.getClassification().isCurrentLearningData();
            this.classificationRules = project.getClassification().isCurrentRuleSet();
        }
    }

    public Boolean getUnions() {
        return unions;
    }

    public void setUnions(Boolean unions) {
        this.unions = unions;
    }

    public Boolean getRulesExternal() {
        return rulesExternal;
    }

    public void setRulesExternal(Boolean rulesExternal) {
        this.rulesExternal = rulesExternal;
    }

    public Boolean getRulesData() {
        return rulesData;
    }

    public void setRulesData(Boolean rulesData) {
        this.rulesData = rulesData;
    }

    public Boolean getClassificationExternal() {
        return classificationExternal;
    }

    public void setClassificationExternal(Boolean classificationExternal) {
        this.classificationExternal = classificationExternal;
    }

    public Boolean getClassificationLearningData() {
        return classificationLearningData;
    }

    public void setClassificationLearningData(Boolean classificationLearningData) {
        this.classificationLearningData = classificationLearningData;
    }

    public Boolean getClassificationRules() {
        return classificationRules;
    }

    public void setClassificationRules(Boolean classificationRules) {
        this.classificationRules = classificationRules;
    }

    @Override
    public String toString() {
        return "ValidityProjectContainer{" +
                "unions=" + unions +
                ", rulesExternal=" + rulesExternal +
                ", rulesData=" + rulesData +
                ", classificationExternal=" + classificationExternal +
                ", classificationLearningData=" + classificationLearningData +
                ", classificationRules=" + classificationRules +
                '}';
    }
}
