package pl.put.poznan.rulestudio.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Arrays;

public class CrossValidationSingleFold {
    private int[] indicesOfTrainingObjects;
    private int[] indicesOfValidationObjects;
    private RuLeStudioRuleSet ruLeStudioRuleSet;
    private Classification classificationOfValidationTable;

    public CrossValidationSingleFold(int[] indicesOfTrainingObjects, int[] indicesOfValidationObjects, RuLeStudioRuleSet ruLeStudioRuleSet, Classification classificationOfValidationTable) {
        this.indicesOfTrainingObjects = indicesOfTrainingObjects;
        this.indicesOfValidationObjects = indicesOfValidationObjects;
        this.ruLeStudioRuleSet = ruLeStudioRuleSet;
        this.classificationOfValidationTable = classificationOfValidationTable;
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

    public Classification getClassificationOfValidationTable() {
        return classificationOfValidationTable;
    }

    public void setClassificationOfValidationTable(Classification classificationOfValidationTable) {
        this.classificationOfValidationTable = classificationOfValidationTable;
    }

    @Override
    public String toString() {
        return "CrossValidationSingleFold{" +
                "indicesOfTrainingObjects=" + Arrays.toString(indicesOfTrainingObjects) +
                ", indicesOfValidationObjects=" + Arrays.toString(indicesOfValidationObjects) +
                ", ruLeStudioRuleSet=" + ruLeStudioRuleSet +
                ", classificationOfValidationTable=" + classificationOfValidationTable +
                '}';
    }
}
