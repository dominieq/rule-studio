package pl.put.poznan.rulestudio.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Arrays;

public class CrossValidationSingleFold {
    private int[] indicesOfTrainingObjects;
    private int[] indicesOfValidationObjects;
    private RuLeStudioRuleSet ruLeStudioRuleSet;
    private FoldClassification foldClassification;

    public CrossValidationSingleFold(int[] indicesOfTrainingObjects, int[] indicesOfValidationObjects, RuLeStudioRuleSet ruLeStudioRuleSet, FoldClassification foldClassification) {
        this.indicesOfTrainingObjects = indicesOfTrainingObjects;
        this.indicesOfValidationObjects = indicesOfValidationObjects;
        this.ruLeStudioRuleSet = ruLeStudioRuleSet;
        this.foldClassification = foldClassification;
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

    public RuLeStudioRuleSet getRuLeStudioRuleSet() {
        return ruLeStudioRuleSet;
    }

    public void setRuLeStudioRuleSet(RuLeStudioRuleSet ruLeStudioRuleSet) {
        this.ruLeStudioRuleSet = ruLeStudioRuleSet;
    }

    public FoldClassification getFoldClassification() {
        return foldClassification;
    }

    public void setFoldClassification(FoldClassification foldClassification) {
        this.foldClassification = foldClassification;
    }

    @Override
    public String toString() {
        return "CrossValidationSingleFold{" +
                "indicesOfTrainingObjects=" + Arrays.toString(indicesOfTrainingObjects) +
                ", indicesOfValidationObjects=" + Arrays.toString(indicesOfValidationObjects) +
                ", ruLeStudioRuleSet=" + ruLeStudioRuleSet +
                ", foldClassification=" + foldClassification +
                '}';
    }
}
