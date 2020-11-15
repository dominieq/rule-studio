package pl.put.poznan.rulestudio.model;

public class ValidityRulesContainer {
    private Boolean unions;
    private Boolean classificationExternal;
    private Boolean classificationProjectData;
    private Boolean classificationRules;
    private Boolean classificationLearningData;

    public ValidityRulesContainer(Project project) {
        UnionsWithHttpParameters unions = project.getUnions();
        if(unions != null) {
            this.unions = unions.isCurrentData();
        }

        ProjectClassification projectClassification = project.getProjectClassification();
        if(projectClassification != null) {
            this.classificationExternal = projectClassification.isExternalData();
            this.classificationProjectData = projectClassification.isCurrentProjectData();
            this.classificationRules = projectClassification.isCurrentRuleSet();
            this.classificationLearningData = projectClassification.isCurrentLearningData();
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

    public Boolean getClassificationProjectData() {
        return classificationProjectData;
    }

    public void setClassificationProjectData(Boolean classificationProjectData) {
        this.classificationProjectData = classificationProjectData;
    }

    public Boolean getClassificationRules() {
        return classificationRules;
    }

    public void setClassificationRules(Boolean classificationRules) {
        this.classificationRules = classificationRules;
    }

    public Boolean getClassificationLearningData() {
        return classificationLearningData;
    }

    public void setClassificationLearningData(Boolean classificationLearningData) {
        this.classificationLearningData = classificationLearningData;
    }

    @Override
    public String toString() {
        return "ValidityRulesContainer{" +
                "unions=" + unions +
                ", classificationExternal=" + classificationExternal +
                ", classificationData=" + classificationProjectData +
                ", classificationRules=" + classificationRules +
                ", classificationLearningData=" + classificationLearningData +
                '}';
    }
}
