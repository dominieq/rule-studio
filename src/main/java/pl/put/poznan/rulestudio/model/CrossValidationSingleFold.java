package pl.put.poznan.rulestudio.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithCharacteristics;

public class CrossValidationSingleFold {
    private int[] indicesOfTrainingObjects;
    private int[] indicesOfValidationObjects;
    private RuleSetWithCharacteristics ruleSetWithCharacteristics;
    private Classification classificationValidationTable;

    public CrossValidationSingleFold(int[] indicesOfTrainingObjects, int[] indicesOfValidationObjects, RuleSetWithCharacteristics ruleSetWithCharacteristics, Classification classificationValidationTable) {
        this.indicesOfTrainingObjects = indicesOfTrainingObjects;
        this.indicesOfValidationObjects = indicesOfValidationObjects;
        this.ruleSetWithCharacteristics = ruleSetWithCharacteristics;
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
    public RuleSetWithCharacteristics getRuleSetWithCharacteristics() {
        return ruleSetWithCharacteristics;
    }

    @JsonProperty("ruleSet")
    public void setRuleSetWithCharacteristics(RuleSetWithCharacteristics ruleSetWithCharacteristics) {
        this.ruleSetWithCharacteristics = ruleSetWithCharacteristics;
    }

    public Classification getClassificationValidationTable() {
        return classificationValidationTable;
    }

    public void setClassificationValidationTable(Classification classificationValidationTable) {
        this.classificationValidationTable = classificationValidationTable;
    }
}
