package pl.put.poznan.rulestudio.model.parameters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.model.CrossValidation;

public class CrossValidationParameters {

    private UnionType typeOfUnions;

    private Double consistencyThreshold;

    private RuleType typeOfRules;

    private ClassifierType classifierType;

    private DefaultClassificationResultType defaultClassificationResultType;

    private Integer numberOfFolds;

    private Long seed;

    private CrossValidationParameters() {
        //private constructor
    }

    public UnionType getTypeOfUnions() {
        return typeOfUnions;
    }

    public Double getConsistencyThreshold() {
        return consistencyThreshold;
    }

    public RuleType getTypeOfRules() {
        return typeOfRules;
    }

    public ClassifierType getClassifierType() {
        return classifierType;
    }

    public DefaultClassificationResultType getDefaultClassificationResultType() {
        return defaultClassificationResultType;
    }

    public Integer getNumberOfFolds() {
        return numberOfFolds;
    }

    public Long getSeed() {
        return seed;
    }

    @Override
    public String toString() {
        return "CrossValidationParameters{" +
                "typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                ", typeOfRules=" + typeOfRules +
                ", classifierType=" + classifierType +
                ", defaultClassificationResultType=" + defaultClassificationResultType +
                ", numberOfFolds=" + numberOfFolds +
                ", seed=" + seed +
                '}';
    }

    public static class CrossValidationParametersBuilder {
        private static final Logger logger = LoggerFactory.getLogger(CrossValidationParametersBuilder.class);

        private UnionType typeOfUnions;
        private Double consistencyThreshold;
        private RuleType typeOfRules;
        private ClassifierType classifierType;
        private DefaultClassificationResultType defaultClassificationResultType;
        private Integer numberOfFolds;
        private Long seed;

        public static CrossValidationParametersBuilder newInstance() {
            return new CrossValidationParametersBuilder();
        }

        public CrossValidationParametersBuilder setTypeOfUnions(UnionType typeOfUnions) {
            this.typeOfUnions = typeOfUnions;
            return this;
        }

        public CrossValidationParametersBuilder setConsistencyThreshold(Double consistencyThreshold) {
            this.consistencyThreshold = consistencyThreshold;
            return this;
        }

        public CrossValidationParametersBuilder setTypeOfRules(RuleType typeOfRules) {
            this.typeOfRules = typeOfRules;
            return this;
        }

        public CrossValidationParametersBuilder setClassifierType(ClassifierType classifierType) {
            this.classifierType = classifierType;
            return this;
        }

        public CrossValidationParametersBuilder setDefaultClassificationResultType(DefaultClassificationResultType defaultClassificationResultType) {
            this.defaultClassificationResultType = defaultClassificationResultType;
            return this;
        }

        public CrossValidationParametersBuilder setNumberOfFolds(Integer numberOfFolds) {
            this.numberOfFolds = numberOfFolds;
            return this;
        }

        public CrossValidationParametersBuilder setSeed(Long seed) {
            this.seed = seed;
            return this;
        }

        public CrossValidationParameters build() {
            CrossValidationParameters crossValidationParameters = new CrossValidationParameters();

            crossValidationParameters.typeOfUnions = this.typeOfUnions;
            crossValidationParameters.consistencyThreshold = this.consistencyThreshold;
            crossValidationParameters.typeOfRules = this.typeOfRules;
            crossValidationParameters.classifierType = this.classifierType;
            crossValidationParameters.defaultClassificationResultType = this.defaultClassificationResultType;
            crossValidationParameters.numberOfFolds = this.numberOfFolds;
            crossValidationParameters.seed = this.seed;

            return crossValidationParameters;
        }

        public CrossValidationParameters build(CrossValidation crossValidation) {
            CrossValidationParameters crossValidationParameters = new CrossValidationParameters();

            crossValidationParameters.typeOfUnions = crossValidation.getTypeOfUnions();
            crossValidationParameters.consistencyThreshold = crossValidation.getConsistencyThreshold();
            crossValidationParameters.typeOfRules = crossValidation.getTypeOfRules();
            crossValidationParameters.classifierType = crossValidation.getTypeOfClassifier();
            crossValidationParameters.defaultClassificationResultType = crossValidation.getDefaultClassificationResult();
            crossValidationParameters.numberOfFolds = crossValidation.getNumberOfFolds();
            crossValidationParameters.seed = crossValidation.getSeed();

            return crossValidationParameters;
        }
    }
}
