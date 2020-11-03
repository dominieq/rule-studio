package pl.put.poznan.rulestudio.model;

public class ValidityRulesContainer {
    private Boolean unions;
    private Boolean classificationExternal;
    private Boolean classificationLearningData;
    private Boolean classificationRules;

    public ValidityRulesContainer(Project project) {
        UnionsWithHttpParameters unions = project.getUnions();
        if(unions != null) {
            this.unions = unions.isCurrentData();
        }

        ProjectClassification projectClassification = project.getProjectClassification();
        if(projectClassification != null) {
            this.classificationExternal = projectClassification.isExternalData();
            this.classificationLearningData = projectClassification.isCurrentLearningData();
            this.classificationRules = projectClassification.isCurrentRuleSet();
        }
    }

    public Boolean getUnions() {
        return unions;
    }

    public void setUnions(Boolean unions) {
        this.unions = unions;
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
        return "ValidityRulesContainer{" +
                "unions=" + unions +
                ", classificationExternal=" + classificationExternal +
                ", classificationLearningData=" + classificationLearningData +
                ", classificationRules=" + classificationRules +
                '}';
    }
}
