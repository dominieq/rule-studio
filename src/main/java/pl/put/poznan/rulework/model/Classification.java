package pl.put.poznan.rulework.model;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.SimpleClassificationResult;
import org.rulelearn.data.InformationTable;

import java.util.Arrays;
import java.util.List;

public class Classification {
    private SimpleClassificationResult[] simpleClassificationResults;
    private InformationTable informationTable;
    private IntList[] indicesOfCoveringRules;
    private IntList[] indicesOfCoveredObjects;

    public Classification(SimpleClassificationResult[] simpleClassificationResults, InformationTable informationTable) {
        this.simpleClassificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
    }

    public Classification(SimpleClassificationResult[] simpleClassificationResults, InformationTable informationTable, IntList[] indicesOfCoveringRules, IntList[] indicesOfCoveredObjects) {
        this.simpleClassificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
        this.indicesOfCoveringRules = indicesOfCoveringRules;
        this.indicesOfCoveredObjects = indicesOfCoveredObjects;
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

    @Override
    public String toString() {
        return "Classification{" +
                "simpleClassificationResults=" + Arrays.toString(simpleClassificationResults) +
                ", informationTable=" + informationTable +
                ", indicesOfCoveringRules=" + indicesOfCoveringRules +
                ", indicesOfCoveredObjects=" + indicesOfCoveredObjects +
                '}';
    }
}
