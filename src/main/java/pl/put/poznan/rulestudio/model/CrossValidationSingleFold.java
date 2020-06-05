package pl.put.poznan.rulestudio.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CrossValidationSingleFold {
    private int[] indicesOfTrainingObjects;
    private int[] indicesOfValidationObjects;
    private RuLeStudioRuleSet ruLeStudioRuleSet;
    private Classification classificationValidationTable;

    public CrossValidationSingleFold(int[] indicesOfTrainingObjects, int[] indicesOfValidationObjects, RuLeStudioRuleSet ruLeStudioRuleSet, Classification classificationValidationTable) {
        this.indicesOfTrainingObjects = indicesOfTrainingObjects;
        this.indicesOfValidationObjects = indicesOfValidationObjects;
        this.ruLeStudioRuleSet = ruLeStudioRuleSet;
        this.classificationValidationTable = classificationValidationTable;
    }

    public int[] getIndicesOfTrainingObjects() {
        return indicesOfTrainingObjects;
    }

    public void setIndicesOfTrainingObjects(int[] indicesOfTrainingObjects) {
        this.indicesOfTrainingObjects = indicesOfTrainingObjects;
    }

    public int[] getIndicesOfValidationObjects() {
        return indicesOfValidationObjects;
    }

    public void setIndicesOfValidationObjects(int[] indicesOfValidationObjects) {
        this.indicesOfValidationObjects = indicesOfValidationObjects;
    }

    @JsonProperty("ruleSet")
    public RuLeStudioRuleSet getRuLeStudioRuleSet() {
        return ruLeStudioRuleSet;
    }

    @JsonProperty("ruleSet")
    public void setRuLeStudioRuleSet(RuLeStudioRuleSet ruLeStudioRuleSet) {
        this.ruLeStudioRuleSet = ruLeStudioRuleSet;
    }

    public Classification getClassificationValidationTable() {
        return classificationValidationTable;
    }

    public void setClassificationValidationTable(Classification classificationValidationTable) {
        this.classificationValidationTable = classificationValidationTable;
    }
}
