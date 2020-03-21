package pl.put.poznan.rulework.model;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.SimpleClassificationResult;
import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;

import java.util.Arrays;

public class Classification {
    private SimpleClassificationResult[] simpleClassificationResults;
    private InformationTable informationTable;
    private Decision[] decisionsDomain;
    private IntList[] indicesOfCoveringRules;
    private OrdinalMisclassificationMatrix ordinalMisclassificationMatrix;

    public Classification(SimpleClassificationResult[] simpleClassificationResults, InformationTable informationTable) {
        this.simpleClassificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
    }

    public Classification(SimpleClassificationResult[] simpleClassificationResults, InformationTable informationTable, Decision[] decisionsDomain, IntList[] indicesOfCoveringRules, OrdinalMisclassificationMatrix ordinalMisclassificationMatrix) {
        this.simpleClassificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
        this.decisionsDomain = decisionsDomain;
        this.indicesOfCoveringRules = indicesOfCoveringRules;
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

    public Decision[] getDecisionsDomain() {
        return decisionsDomain;
    }

    public void setDecisionsDomain(Decision[] decisionsDomain) {
        this.decisionsDomain = decisionsDomain;
    }

    public IntList[] getindicesOfCoveringRules() {
        return indicesOfCoveringRules;
    }

    public void setindicesOfCoveringRules(IntList[] indicesOfCoveringRules) {
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
                "simpleClassificationResults=" + Arrays.toString(simpleClassificationResults) +
                ", informationTable=" + informationTable +
                ", decisionsDomain=" + Arrays.toString(decisionsDomain) +
                ", indicesOfCoveringRules=" + Arrays.toString(indicesOfCoveringRules) +
                ", ordinalMisclassificationMatrix=" + ordinalMisclassificationMatrix +
                '}';
    }
}
