package pl.put.poznan.rulework.model;

import org.rulelearn.data.InformationTable;
import org.rulelearn.sampling.CrossValidator;
import org.rulelearn.sampling.CrossValidator.CrossValidationFold;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulework.enums.ClassifierType;
import pl.put.poznan.rulework.enums.DefaultClassificationResultType;
import pl.put.poznan.rulework.enums.RuleType;
import pl.put.poznan.rulework.enums.UnionType;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class CrossValidation {
    private Integer numberOfFolds;
    private CrossValidationSingleFold crossValidationSingleFolds[];
    private OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix;
    private UnionType typeOfUnion;
    private Double consistencyThreshold;
    private RuleType typeOfRule;
    private ClassifierType typeOfClassifier;
    private DefaultClassificationResultType defaultClassificationResult;

    public CrossValidation(Integer numberOfFolds, CrossValidationSingleFold[] crossValidationSingleFolds, OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix) {
        this.numberOfFolds = numberOfFolds;
        this.crossValidationSingleFolds = crossValidationSingleFolds;
        this.meanOrdinalMisclassificationMatrix = meanOrdinalMisclassificationMatrix;
    }

    public CrossValidation(Integer numberOfFolds, CrossValidationSingleFold[] crossValidationSingleFolds, OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix, UnionType typeOfUnion, Double consistencyThreshold, RuleType typeOfRule, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult) {
        this.numberOfFolds = numberOfFolds;
        this.crossValidationSingleFolds = crossValidationSingleFolds;
        this.meanOrdinalMisclassificationMatrix = meanOrdinalMisclassificationMatrix;
        this.typeOfUnion = typeOfUnion;
        this.consistencyThreshold = consistencyThreshold;
        this.typeOfRule = typeOfRule;
        this.typeOfClassifier = typeOfClassifier;
        this.defaultClassificationResult = defaultClassificationResult;
    }

    public Integer getNumberOfFolds() {
        return numberOfFolds;
    }

    public void setNumberOfFolds(Integer numberOfFolds) {
        this.numberOfFolds = numberOfFolds;
    }

    public CrossValidationSingleFold[] getCrossValidationSingleFolds() {
        return crossValidationSingleFolds;
    }

    public void setCrossValidationSingleFolds(CrossValidationSingleFold[] crossValidationSingleFolds) {
        this.crossValidationSingleFolds = crossValidationSingleFolds;
    }

    public OrdinalMisclassificationMatrix getMeanOrdinalMisclassificationMatrix() {
        return meanOrdinalMisclassificationMatrix;
    }

    public void setMeanOrdinalMisclassificationMatrix(OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix) {
        this.meanOrdinalMisclassificationMatrix = meanOrdinalMisclassificationMatrix;
    }

    public UnionType getTypeOfUnion() {
        return typeOfUnion;
    }

    public void setTypeOfUnion(UnionType typeOfUnion) {
        this.typeOfUnion = typeOfUnion;
    }

    public Double getConsistencyThreshold() {
        return consistencyThreshold;
    }

    public void setConsistencyThreshold(Double consistencyThreshold) {
        this.consistencyThreshold = consistencyThreshold;
    }

    public RuleType getTypeOfRule() {
        return typeOfRule;
    }

    public void setTypeOfRule(RuleType typeOfRule) {
        this.typeOfRule = typeOfRule;
    }

    public ClassifierType getTypeOfClassifier() {
        return typeOfClassifier;
    }

    public void setTypeOfClassifier(ClassifierType typeOfClassifier) {
        this.typeOfClassifier = typeOfClassifier;
    }

    public DefaultClassificationResultType getDefaultClassificationResult() {
        return defaultClassificationResult;
    }

    public void setDefaultClassificationResult(DefaultClassificationResultType defaultClassificationResult) {
        this.defaultClassificationResult = defaultClassificationResult;
    }

    @Override
    public String toString() {
        return "CrossValidation{" +
                "numberOfFolds=" + numberOfFolds +
                ", crossValidationSingleFolds=" + Arrays.toString(crossValidationSingleFolds) +
                ", meanOrdinalMisclassificationMatrix=" + meanOrdinalMisclassificationMatrix +
                ", typeOfUnion=" + typeOfUnion +
                ", consistencyThreshold=" + consistencyThreshold +
                ", typeOfRule=" + typeOfRule +
                ", typeOfClassifier=" + typeOfClassifier +
                ", defaultClassificationResult=" + defaultClassificationResult +
                '}';
    }
}
