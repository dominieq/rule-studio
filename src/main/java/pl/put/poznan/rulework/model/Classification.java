package pl.put.poznan.rulework.model;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.SimpleClassificationResult;
import org.rulelearn.data.InformationTable;
import org.rulelearn.validation.ClassificationValidationResult;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;

import java.util.Arrays;
import java.util.List;

public class Classification {
    private SimpleClassificationResult[] simpleClassificationResults;
    private InformationTable informationTable;
    private IntList[] indicesOfCoveringRules;
    private IntList[] indicesOfCoveredObjects;
    private ClassificationValidationResult classificationValidationResult;
    private OrdinalMisclassificationMatrix ordinalMisclassificationMatrix;

    public Classification(SimpleClassificationResult[] simpleClassificationResults, InformationTable informationTable) {
        this.simpleClassificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
    }

    public Classification(SimpleClassificationResult[] simpleClassificationResults, InformationTable informationTable, IntList[] indicesOfCoveringRules, IntList[] indicesOfCoveredObjects, ClassificationValidationResult classificationValidationResult, OrdinalMisclassificationMatrix ordinalMisclassificationMatrix) {
        this.simpleClassificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
        this.indicesOfCoveringRules = indicesOfCoveringRules;
        this.indicesOfCoveredObjects = indicesOfCoveredObjects;
        this.classificationValidationResult = classificationValidationResult;
        this.ordinalMisclassificationMatrix = ordinalMisclassificationMatrix;
    }

    public SimpleClassificationResult[] getSimpleClassificationResults() {
        return simpleClassificationResults;
    }

    public void setSimpleClassificationResults(SimpleClassificationResult[] simpleClassificationResults) {
        this.simpleClassificationResults = simpleClassificationResults;
    }

    public InformationTable getInformationTable() {
        return informationTable;
    }

    public void setInformationTable(InformationTable informationTable) {
        this.informationTable = informationTable;
    }

    public IntList[] getindicesOfCoveringRules() {
        return indicesOfCoveringRules;
    }

    public void setindicesOfCoveringRules(IntList[] indicesOfCoveringRules) {
        this.indicesOfCoveringRules = indicesOfCoveringRules;
    }

    public IntList[] getindicesOfCoveredObjects() {
        return indicesOfCoveredObjects;
    }

    public void setindicesOfCoveredObjects(IntList[] indicesOfCoveredObjects) {
        this.indicesOfCoveredObjects = indicesOfCoveredObjects;
    }

    public ClassificationValidationResult getClassificationValidationResult() {
        return classificationValidationResult;
    }

    public void setClassificationValidationResult(ClassificationValidationResult classificationValidationResult) {
        this.classificationValidationResult = classificationValidationResult;
    }

    public OrdinalMisclassificationMatrix getOrdinalMisclassificationMatrix() {
        return ordinalMisclassificationMatrix;
    }

    public void setOrdinalMisclassificationMatrix(OrdinalMisclassificationMatrix ordinalMisclassificationMatrix) {
        this.ordinalMisclassificationMatrix = ordinalMisclassificationMatrix;
    }

    @Override
    public String toString() {
        return "Classification{" +
                "simpleClassificationResults=" + Arrays.toString(simpleClassificationResults) +
                ", informationTable=" + informationTable +
                ", indicesOfCoveringRules=" + Arrays.toString(indicesOfCoveringRules) +
                ", indicesOfCoveredObjects=" + Arrays.toString(indicesOfCoveredObjects) +
                ", classificationValidationResult=" + classificationValidationResult +
                ", ordinalMisclassificationMatrix=" + ordinalMisclassificationMatrix +
                '}';
    }
}
