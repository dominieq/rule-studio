package pl.put.poznan.rulestudio.model;

import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;

import java.util.Arrays;

public class CrossValidation {
    private Integer numberOfFolds;
    private CrossValidationSingleFold crossValidationSingleFolds[];
    private OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix;
    private OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix;
    private UnionType typeOfUnions;
    private Double consistencyThreshold;
    private RuleType typeOfRules;
    private ClassifierType typeOfClassifier;
    private DefaultClassificationResultType defaultClassificationResult;
    private Long seed;

    public CrossValidation(Integer numberOfFolds, CrossValidationSingleFold[] crossValidationSingleFolds, OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix, OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix) {
        this.numberOfFolds = numberOfFolds;
        this.crossValidationSingleFolds = crossValidationSingleFolds;
        this.meanOrdinalMisclassificationMatrix = meanOrdinalMisclassificationMatrix;
        this.sumOrdinalMisclassificationMatrix = sumOrdinalMisclassificationMatrix;
    }

    public CrossValidation(
            Integer numberOfFolds,
            CrossValidationSingleFold[] crossValidationSingleFolds,
            OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix,
            OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix,
            UnionType typeOfUnions,
            Double consistencyThreshold, RuleType typeOfRules,
            ClassifierType typeOfClassifier,
            DefaultClassificationResultType defaultClassificationResult,
            Long seed) {

        this.numberOfFolds = numberOfFolds;
        this.crossValidationSingleFolds = crossValidationSingleFolds;
        this.meanOrdinalMisclassificationMatrix = meanOrdinalMisclassificationMatrix;
        this.sumOrdinalMisclassificationMatrix = sumOrdinalMisclassificationMatrix;
        this.typeOfUnions = typeOfUnions;
        this.consistencyThreshold = consistencyThreshold;
        this.typeOfRules = typeOfRules;
        this.typeOfClassifier = typeOfClassifier;
        this.defaultClassificationResult = defaultClassificationResult;
        this.seed = seed;
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

    public OrdinalMisclassificationMatrix getSumOrdinalMisclassificationMatrix() {
        return sumOrdinalMisclassificationMatrix;
    }

    public void setSumOrdinalMisclassificationMatrix(OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix) {
        this.sumOrdinalMisclassificationMatrix = sumOrdinalMisclassificationMatrix;
    }

    public UnionType getTypeOfUnions() {
        return typeOfUnions;
    }

    public void setTypeOfUnions(UnionType typeOfUnions) {
        this.typeOfUnions = typeOfUnions;
    }

    public Double getConsistencyThreshold() {
        return consistencyThreshold;
    }

    public void setConsistencyThreshold(Double consistencyThreshold) {
        this.consistencyThreshold = consistencyThreshold;
    }

    public RuleType getTypeOfRules() {
        return typeOfRules;
    }

    public void setTypeOfRules(RuleType typeOfRules) {
        this.typeOfRules = typeOfRules;
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

    public Long getSeed() {
        return seed;
    }

    public void setSeed(Long seed) {
        this.seed = seed;
    }

    @Override
    public String toString() {
        return "CrossValidation{" +
                "numberOfFolds=" + numberOfFolds +
                ", crossValidationSingleFolds=" + Arrays.toString(crossValidationSingleFolds) +
                ", meanOrdinalMisclassificationMatrix=" + meanOrdinalMisclassificationMatrix +
                ", sumOrdinalMisclassificationMatrix=" + sumOrdinalMisclassificationMatrix +
                ", typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                ", typeOfRules=" + typeOfRules +
                ", typeOfClassifier=" + typeOfClassifier +
                ", defaultClassificationResult=" + defaultClassificationResult +
                ", seed=" + seed +
                '}';
    }
}
