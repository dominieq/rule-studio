package pl.put.poznan.rulestudio.model.response;

import org.rulelearn.approximations.Union.UnionType;
import org.rulelearn.approximations.UnionWithSingleLimitingDecision;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClassUnionMainProperties {

    private UnionType unionType;

    private String limitingDecision;

    private Double accuracyOfApproximation;

    private Double qualityOfApproximation;

    private ClassUnionMainProperties() {
        //private constructor
    }

    public UnionType getUnionType() {
        return unionType;
    }

    public String getLimitingDecision() {
        return limitingDecision;
    }

    public Double getAccuracyOfApproximation() {
        return accuracyOfApproximation;
    }

    public Double getQualityOfApproximation() {
        return qualityOfApproximation;
    }

    public static class ClassUnionMainPropertiesBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ClassUnionMainPropertiesBuilder.class);

        private UnionType unionType;
        private String limitingDecision;
        private Double accuracyOfApproximation;
        private Double qualityOfApproximation;

        public static ClassUnionMainPropertiesBuilder newInstance() {
            return new ClassUnionMainPropertiesBuilder();
        }

        public ClassUnionMainPropertiesBuilder setUnionType(UnionType unionType) {
            this.unionType = unionType;
            return this;
        }

        public ClassUnionMainPropertiesBuilder setLimitingDecision(String limitingDecision) {
            this.limitingDecision = limitingDecision;
            return this;
        }

        public ClassUnionMainPropertiesBuilder setAccuracyOfApproximation(Double accuracyOfApproximation) {
            this.accuracyOfApproximation = accuracyOfApproximation;
            return this;
        }

        public ClassUnionMainPropertiesBuilder setQualityOfApproximation(Double qualityOfApproximation) {
            this.qualityOfApproximation = qualityOfApproximation;
            return this;
        }

        public ClassUnionMainProperties build() {
            ClassUnionMainProperties classUnionMainProperties = new ClassUnionMainProperties();

            classUnionMainProperties.unionType = this.unionType;
            classUnionMainProperties.limitingDecision = this.limitingDecision;
            classUnionMainProperties.accuracyOfApproximation = this.accuracyOfApproximation;
            classUnionMainProperties.qualityOfApproximation = this.qualityOfApproximation;

            return classUnionMainProperties;
        }

        public ClassUnionMainProperties build(UnionWithSingleLimitingDecision union) {
            ClassUnionMainProperties classUnionMainProperties = new ClassUnionMainProperties();

            classUnionMainProperties.unionType = union.getUnionType();
            classUnionMainProperties.accuracyOfApproximation = union.getAccuracyOfApproximation();
            classUnionMainProperties.qualityOfApproximation = union.getQualityOfApproximation();

            final int attributeIndex = union.getLimitingDecision().getAttributeIndices().iterator().nextInt(); //assumption that there is only one decision attribute
            final EvaluationField evaluationField = union.getLimitingDecision().getEvaluation(attributeIndex);
            classUnionMainProperties.limitingDecision = evaluationField.toString();

            return classUnionMainProperties;
        }
    }
}
