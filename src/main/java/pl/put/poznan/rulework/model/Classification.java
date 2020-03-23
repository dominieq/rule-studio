package pl.put.poznan.rulework.model;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.ClassificationResult;
import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;

import java.util.Arrays;

public class Classification {
    private ClassificationResult[] classificationResults;
    private InformationTable informationTable;
    private Decision[] orderOfDecisions;
    private IntList[] indicesOfCoveringRules;
    private OrdinalMisclassificationMatrix ordinalMisclassificationMatrix;

    public Classification(ClassificationResult[] simpleClassificationResults, InformationTable informationTable) {
        this.classificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
    }

    public Classification(ClassificationResult[] simpleClassificationResults, InformationTable informationTable, Decision[] orderOfDecisions, IntList[] indicesOfCoveringRules, OrdinalMisclassificationMatrix ordinalMisclassificationMatrix) {
        this.classificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
        this.orderOfDecisions = orderOfDecisions;
        this.indicesOfCoveringRules = indicesOfCoveringRules;
        this.ordinalMisclassificationMatrix = ordinalMisclassificationMatrix;
    }

    public ClassificationResult[] getClassificationResults() {
        return classificationResults;
    }

    public void setClassificationResults(ClassificationResult[] classificationResults) {
        this.classificationResults = classificationResults;
    }

    public InformationTable getInformationTable() {
        return informationTable;
    }

    public void setInformationTable(InformationTable informationTable) {
        this.informationTable = informationTable;
    }

    public Decision[] getOrderOfDecisions() {
        return orderOfDecisions;
    }

    public void setOrderOfDecisions(Decision[] orderOfDecisions) {
        this.orderOfDecisions = orderOfDecisions;
    }

    public IntList[] getIndicesOfCoveringRules() {
        return indicesOfCoveringRules;
    }

    public void setIndicesOfCoveringRules(IntList[] indicesOfCoveringRules) {
        this.indicesOfCoveringRules = indicesOfCoveringRules;
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
                "classificationResults=" + Arrays.toString(classificationResults) +
                ", informationTable=" + informationTable +
                ", orderOfDecisions=" + Arrays.toString(orderOfDecisions) +
                ", indicesOfCoveringRules=" + Arrays.toString(indicesOfCoveringRules) +
                ", ordinalMisclassificationMatrix=" + ordinalMisclassificationMatrix +
                '}';
    }
}
