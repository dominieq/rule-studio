package pl.put.poznan.rulework.model;

import org.rulelearn.classification.SimpleClassificationResult;

import java.util.Arrays;

public class Classification {
    private SimpleClassificationResult[] simpleClassificationResults;

    public Classification(SimpleClassificationResult[] simpleClassificationResults) {
        this.simpleClassificationResults = simpleClassificationResults;
    }

    public SimpleClassificationResult[] getSimpleClassificationResults() {
        return simpleClassificationResults;
    }

    public void setSimpleClassificationResults(SimpleClassificationResult[] simpleClassificationResults) {
        this.simpleClassificationResults = simpleClassificationResults;
    }

    @Override
    public String toString() {
        return "Classification{" +
                "simpleClassificationResults=" + Arrays.toString(simpleClassificationResults) +
                '}';
    }
}
