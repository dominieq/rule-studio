package pl.put.poznan.rulework.model;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithComputableCharacteristics;
import org.rulelearn.sampling.CrossValidator;
import pl.put.poznan.rulework.service.ClassificationService;
import pl.put.poznan.rulework.service.RulesService;
import pl.put.poznan.rulework.service.UnionsWithSingleLimitingDecisionService;

public class CrossValidationSingleFold {
    private InformationTable trainingTable;
    private InformationTable validationTable;
    private UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision;
    private RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics;
    private Classification classificationTrainingTable;
    private Classification classificationValidationTable;

    public CrossValidationSingleFold(InformationTable trainingTable, InformationTable validationTable, UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision, RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics, Classification classificationTrainingTable, Classification classificationValidationTable) {
        this.trainingTable = trainingTable;
        this.validationTable = validationTable;
        this.unionsWithSingleLimitingDecision = unionsWithSingleLimitingDecision;
        this.ruleSetWithComputableCharacteristics = ruleSetWithComputableCharacteristics;
        this.classificationTrainingTable = classificationTrainingTable;
        this.classificationValidationTable = classificationValidationTable;
    }

    public InformationTable getTrainingTable() {
        return trainingTable;
    }

    public void setTrainingTable(InformationTable trainingTable) {
        this.trainingTable = trainingTable;
    }

    public InformationTable getValidationTable() {
        return validationTable;
    }

    public void setValidationTable(InformationTable validationTable) {
        this.validationTable = validationTable;
    }

    public UnionsWithSingleLimitingDecision getUnionsWithSingleLimitingDecision() {
        return unionsWithSingleLimitingDecision;
    }

    public void setUnionsWithSingleLimitingDecision(UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision) {
        this.unionsWithSingleLimitingDecision = unionsWithSingleLimitingDecision;
    }

    public RuleSetWithComputableCharacteristics getRuleSetWithComputableCharacteristics() {
        return ruleSetWithComputableCharacteristics;
    }

    public void setRuleSetWithComputableCharacteristics(RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics) {
        this.ruleSetWithComputableCharacteristics = ruleSetWithComputableCharacteristics;
    }

    public Classification getClassificationTrainingTable() {
        return classificationTrainingTable;
    }

    public void setClassificationTrainingTable(Classification classificationTrainingTable) {
        this.classificationTrainingTable = classificationTrainingTable;
    }

    public Classification getClassificationValidationTable() {
        return classificationValidationTable;
    }

    public void setClassificationValidationTable(Classification classificationValidationTable) {
        this.classificationValidationTable = classificationValidationTable;
    }
}
