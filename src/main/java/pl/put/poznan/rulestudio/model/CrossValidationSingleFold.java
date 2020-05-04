package pl.put.poznan.rulestudio.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithCharacteristics;

public class CrossValidationSingleFold {
    private InformationTable validationTable;
    private RuleSetWithCharacteristics ruleSetWithCharacteristics;
    private Classification classificationValidationTable;
    private Integer numberOfLearningObjects;

    public CrossValidationSingleFold(InformationTable validationTable, RuleSetWithCharacteristics ruleSetWithCharacteristics, Classification classificationValidationTable, Integer numberOfLearningObjects) {
        this.validationTable = validationTable;
        this.ruleSetWithCharacteristics = ruleSetWithCharacteristics;
        this.classificationValidationTable = classificationValidationTable;
        this.numberOfLearningObjects = numberOfLearningObjects;
    }

    public InformationTable getValidationTable() {
        return validationTable;
    }

    public void setValidationTable(InformationTable validationTable) {
        this.validationTable = validationTable;
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

    public Integer getNumberOfLearningObjects() {
        return numberOfLearningObjects;
    }

    public void setNumberOfLearningObjects(Integer numberOfLearningObjects) {
        this.numberOfLearningObjects = numberOfLearningObjects;
    }
}
