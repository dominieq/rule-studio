package pl.put.poznan.rulework.model;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.SimpleClassificationResult;
import org.rulelearn.data.InformationTable;

import java.util.Arrays;
import java.util.List;

public class Classification {
    private SimpleClassificationResult[] simpleClassificationResults;
    private InformationTable informationTable;
    private IntList[] indiciesOfCoveringRules;
    private IntList[] indiciesOfCoveredObjects;

    public Classification(SimpleClassificationResult[] simpleClassificationResults, InformationTable informationTable) {
        this.simpleClassificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
    }

    public Classification(SimpleClassificationResult[] simpleClassificationResults, InformationTable informationTable, IntList[] indiciesOfCoveringRules, IntList[] indiciesOfCoveredObjects) {
        this.simpleClassificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
        this.indiciesOfCoveringRules = indiciesOfCoveringRules;
        this.indiciesOfCoveredObjects = indiciesOfCoveredObjects;
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

    public IntList[] getIndiciesOfCoveringRules() {
        return indiciesOfCoveringRules;
    }

    public void setIndiciesOfCoveringRules(IntList[] indiciesOfCoveringRules) {
        this.indiciesOfCoveringRules = indiciesOfCoveringRules;
    }

    public IntList[] getIndiciesOfCoveredObjects() {
        return indiciesOfCoveredObjects;
    }

    public void setIndiciesOfCoveredObjects(IntList[] indiciesOfCoveredObjects) {
        this.indiciesOfCoveredObjects = indiciesOfCoveredObjects;
    }

    @Override
    public String toString() {
        return "Classification{" +
                "simpleClassificationResults=" + Arrays.toString(simpleClassificationResults) +
                ", informationTable=" + informationTable +
                ", indiciesOfCoveringRules=" + indiciesOfCoveringRules +
                ", indiciesOfCoveredObjects=" + indiciesOfCoveredObjects +
                '}';
    }
}
