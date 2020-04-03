package pl.put.poznan.rulework.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithComputableCharacteristics;

public class CrossValidationSingleFold {
    private InformationTable validationTable;
    private RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics;
    private Classification classificationValidationTable;

    public CrossValidationSingleFold(InformationTable validationTable, RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics, Classification classificationValidationTable) {
        this.validationTable = validationTable;
        this.ruleSetWithComputableCharacteristics = ruleSetWithComputableCharacteristics;
        this.classificationValidationTable = classificationValidationTable;
    }

    public InformationTable getValidationTable() {
        return validationTable;
    }

    public void setValidationTable(InformationTable validationTable) {
        this.validationTable = validationTable;
    }

    @JsonProperty("ruleSet")
    public RuleSetWithComputableCharacteristics getRuleSetWithComputableCharacteristics() {
        return ruleSetWithComputableCharacteristics;
    }

    @JsonProperty("ruleSet")
    public void setRuleSetWithComputableCharacteristics(RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics) {
        this.ruleSetWithComputableCharacteristics = ruleSetWithComputableCharacteristics;
    }

    public Classification getClassificationValidationTable() {
        return classificationValidationTable;
    }

    public void setClassificationValidationTable(Classification classificationValidationTable) {
        this.classificationValidationTable = classificationValidationTable;
    }
}
