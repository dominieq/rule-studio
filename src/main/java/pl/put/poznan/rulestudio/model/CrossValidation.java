package pl.put.poznan.rulestudio.model;

import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;

import java.util.Arrays;

public class CrossValidation {
    private Integer numberOfFolds;
    private InformationTable informationTable;
    private CrossValidationSingleFold[] crossValidationSingleFolds;
    private Decision[] orderOfDecisions;
    private OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix;
    private OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix;
    private UnionType typeOfUnions;
    private Double consistencyThreshold;
    private RuleType typeOfRules;
    private ClassifierType classifierType;
    private DefaultClassificationResultType defaultClassificationResultType;
    private Long seed;
    private String dataHash;
    private Boolean isCurrentData;
    private DescriptiveAttributes descriptiveAttributes;

    public CrossValidation(Integer numberOfFolds, CrossValidationSingleFold[] crossValidationSingleFolds, OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix, OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix) {
        this.numberOfFolds = numberOfFolds;
        this.crossValidationSingleFolds = crossValidationSingleFolds;
        this.meanOrdinalMisclassificationMatrix = meanOrdinalMisclassificationMatrix;
        this.sumOrdinalMisclassificationMatrix = sumOrdinalMisclassificationMatrix;
    }

    public CrossValidation(
            Integer numberOfFolds,
            InformationTable informationTable,
            CrossValidationSingleFold[] crossValidationSingleFolds,
            Decision[] orderOfDecisions,
            OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix,
            OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix,
            UnionType typeOfUnions,
            Double consistencyThreshold, RuleType typeOfRules,
            ClassifierType classifierType,
            DefaultClassificationResultType defaultClassificationResultType,
            Long seed,
            String dataHash,
            DescriptiveAttributes descriptiveAttributes) {

        this.numberOfFolds = numberOfFolds;
        this.informationTable = informationTable;
        this.crossValidationSingleFolds = crossValidationSingleFolds;
        this.orderOfDecisions = orderOfDecisions;
        this.meanOrdinalMisclassificationMatrix = meanOrdinalMisclassificationMatrix;
        this.sumOrdinalMisclassificationMatrix = sumOrdinalMisclassificationMatrix;
        this.typeOfUnions = typeOfUnions;
        this.consistencyThreshold = consistencyThreshold;
        this.typeOfRules = typeOfRules;
        this.classifierType = classifierType;
        this.defaultClassificationResultType = defaultClassificationResultType;
        this.seed = seed;
        this.dataHash = dataHash;
        this.descriptiveAttributes = descriptiveAttributes;

        this.isCurrentData = true;
    }

    public Integer getNumberOfFolds() {
        return numberOfFolds;
    }

    public void setNumberOfFolds(Integer numberOfFolds) {
        this.numberOfFolds = numberOfFolds;
    }

    public InformationTable getInformationTable() {
        return informationTable;
    }

    public void setInformationTable(InformationTable informationTable) {
        this.informationTable = informationTable;
    }

    public CrossValidationSingleFold[] getCrossValidationSingleFolds() {
        return crossValidationSingleFolds;
    }

    public void setCrossValidationSingleFolds(CrossValidationSingleFold[] crossValidationSingleFolds) {
        this.crossValidationSingleFolds = crossValidationSingleFolds;
    }

    public Decision[] getOrderOfDecisions() {
        return orderOfDecisions;
    }

    public void setOrderOfDecisions(Decision[] orderOfDecisions) {
        this.orderOfDecisions = orderOfDecisions;
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

    public ClassifierType getClassifierType() {
        return classifierType;
    }

    public void setClassifierType(ClassifierType classifierType) {
        this.classifierType = classifierType;
    }

    public DefaultClassificationResultType getDefaultClassificationResultType() {
        return defaultClassificationResultType;
    }

    public void setDefaultClassificationResultType(DefaultClassificationResultType defaultClassificationResultType) {
        this.defaultClassificationResultType = defaultClassificationResultType;
    }

    public Long getSeed() {
        return seed;
    }

    public void setSeed(Long seed) {
        this.seed = seed;
    }

    public String getDataHash() {
        return dataHash;
    }

    public void setDataHash(String dataHash) {
        this.dataHash = dataHash;
    }

    public Boolean isCurrentData() {
        return isCurrentData;
    }

    public void setCurrentData(Boolean currentData) {
        isCurrentData = currentData;
    }

    public DescriptiveAttributes getDescriptiveAttributes() {
        return descriptiveAttributes;
    }

    public void setDescriptiveAttributes(DescriptiveAttributes descriptiveAttributes) {
        this.descriptiveAttributes = descriptiveAttributes;
    }

    @Override
    public String toString() {
        return "CrossValidation{" +
                "numberOfFolds=" + numberOfFolds +
                ", informationTable=" + informationTable +
                ", crossValidationSingleFolds=" + Arrays.toString(crossValidationSingleFolds) +
                ", orderOfDecisions=" + Arrays.toString(orderOfDecisions) +
                ", meanOrdinalMisclassificationMatrix=" + meanOrdinalMisclassificationMatrix +
                ", sumOrdinalMisclassificationMatrix=" + sumOrdinalMisclassificationMatrix +
                ", typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                ", typeOfRules=" + typeOfRules +
                ", classifierType=" + classifierType +
                ", defaultClassificationResultType=" + defaultClassificationResultType +
                ", seed=" + seed +
                ", dataHash='" + dataHash + '\'' +
                ", isCurrentData=" + isCurrentData +
                ", descriptiveAttributes=" + descriptiveAttributes +
                '}';
    }
}
