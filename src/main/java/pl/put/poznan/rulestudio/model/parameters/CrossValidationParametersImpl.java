package pl.put.poznan.rulestudio.model.parameters;

import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;

import java.util.Objects;

public class CrossValidationParametersImpl implements CrossValidationParameters, ClassificationParameters, RulesParameters {

    private RulesParameters rulesParameters;

    private ClassificationParameters classificationParameters;

    private Integer numberOfFolds;

    private Long seed;

    public CrossValidationParametersImpl(UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, ClassifierType classifierType, DefaultClassificationResultType defaultClassificationResultType, Integer numberOfFolds, Long seed) {
        this.rulesParameters = RulesParametersImpl.getInstance(typeOfUnions, consistencyThreshold, typeOfRules);
        this.classificationParameters = new ClassificationParametersImpl(classifierType, defaultClassificationResultType);
        this.numberOfFolds = numberOfFolds;
        this.seed = seed;
    }

    public UnionType getTypeOfUnions() {
        return rulesParameters.getTypeOfUnions();
    }

    public Double getConsistencyThreshold() {
        return rulesParameters.getConsistencyThreshold();
    }

    public RuleType getTypeOfRules() {
        return rulesParameters.getTypeOfRules();
    }

    public ClassifierType getClassifierType() {
        return classificationParameters.getClassifierType();
    }

    public DefaultClassificationResultType getDefaultClassificationResultType() {
        return classificationParameters.getDefaultClassificationResultType();
    }

    public Integer getNumberOfFolds() {
        return numberOfFolds;
    }

    public Long getSeed() {
        return seed;
    }

    @Override
    public Boolean equalsTo(RulesParameters that) {
        return this.rulesParameters.equalsTo(that);
    }

    @Override
    public Boolean equalsTo(ClassUnionsParameters that) {
        return this.rulesParameters.equalsTo(that);
    }

    @Override
    public Boolean equalsTo(ClassificationParameters that) {
        return this.classificationParameters.equalsTo(that);
    }

    @Override
    public Boolean equalsTo(CrossValidationParameters that) {
        if (that == null) return false;
        if (!this.rulesParameters.equalsTo((RulesParameters) that)) return false;
        if (!this.classificationParameters.equalsTo((ClassificationParameters) that)) return false;
        return Objects.equals(getNumberOfFolds(), that.getNumberOfFolds()) &&
                Objects.equals(getSeed(), that.getSeed());
    }

    @Override
    public String toString() {
        return "CrossValidationParametersImpl{" +
                "rulesParameters=" + rulesParameters +
                ", classificationParameters=" + classificationParameters +
                ", numberOfFolds=" + numberOfFolds +
                ", seed=" + seed +
                '}';
    }
}
