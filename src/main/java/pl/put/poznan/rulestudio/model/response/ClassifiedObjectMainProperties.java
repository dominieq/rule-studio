package pl.put.poznan.rulestudio.model.response;

import org.rulelearn.classification.ClassificationResult;
import org.rulelearn.classification.SimpleEvaluatedClassificationResult;
import org.rulelearn.data.Decision;
import org.rulelearn.data.SimpleDecision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.AbstractClassification;

public class ClassifiedObjectMainProperties {

    private String originalDecision;

    private String suggestedDecision;

    private Double certainty;

    private Integer numberOfCoveringRules;

    private ClassifiedObjectMainProperties() {
        //private constructor
    }

    public String getOriginalDecision() {
        return originalDecision;
    }

    public String getSuggestedDecision() {
        return suggestedDecision;
    }

    public Double getCertainty() {
        return certainty;
    }

    public Integer getNumberOfCoveringRules() {
        return numberOfCoveringRules;
    }

    @Override
    public String toString() {
        return "ClassifiedObjectMainProperties{" +
                "originalDecision=" + originalDecision +
                ", suggestedDecision=" + suggestedDecision +
                ", certainty=" + certainty +
                ", numberOfCoveringRules=" + numberOfCoveringRules +
                '}';
    }

    public static class ClassifiedObjectMainPropertiesBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ClassifiedObjectMainPropertiesBuilder.class);

        private String originalDecision;
        private String suggestedDecision;
        private Double certainty;
        private Integer numberOfCoveringRules;

        public static ClassifiedObjectMainPropertiesBuilder newInstance() {
            return new ClassifiedObjectMainPropertiesBuilder();
        }

        public ClassifiedObjectMainPropertiesBuilder setOriginalDecision(String originalDecision) {
            this.originalDecision = originalDecision;
            return this;
        }

        public ClassifiedObjectMainPropertiesBuilder setSuggestedDecision(String suggestedDecision) {
            this.suggestedDecision = suggestedDecision;
            return this;
        }

        public ClassifiedObjectMainPropertiesBuilder setCertainty(Double certainty) {
            this.certainty = certainty;
            return this;
        }

        public ClassifiedObjectMainPropertiesBuilder setNumberOfCoveringRules(Integer numberOfCoveringRules) {
            this.numberOfCoveringRules = numberOfCoveringRules;
            return this;
        }

        public ClassifiedObjectMainProperties build() {
            ClassifiedObjectMainProperties classifiedObjectMainProperties = new ClassifiedObjectMainProperties();

            classifiedObjectMainProperties.originalDecision = this.originalDecision;
            classifiedObjectMainProperties.suggestedDecision = this.suggestedDecision;
            classifiedObjectMainProperties.certainty = this.certainty;
            classifiedObjectMainProperties.numberOfCoveringRules = this.numberOfCoveringRules;

            return classifiedObjectMainProperties;
        }

        public ClassifiedObjectMainProperties build(AbstractClassification abstractClassification, Integer classifiedObjectIndex, Decision originalDecision) {
            ClassifiedObjectMainProperties classifiedObjectMainProperties = new ClassifiedObjectMainProperties();

            final int attributeIndex = originalDecision.getAttributeIndices().iterator().nextInt(); //assumption that there is only one decision attribute
            classifiedObjectMainProperties.originalDecision = originalDecision.getEvaluation(attributeIndex).toString();

            ClassificationResult classificationResult = abstractClassification.getClassificationResults()[classifiedObjectIndex];
            final Decision suggestedDecision = classificationResult.getSuggestedDecision();
            classifiedObjectMainProperties.suggestedDecision = ((SimpleDecision)suggestedDecision).getEvaluation().toString();

            if(classificationResult instanceof SimpleEvaluatedClassificationResult) {
                classifiedObjectMainProperties.certainty = ((SimpleEvaluatedClassificationResult)classificationResult).getSuggestedDecisionEvaluation();
            } else {
                classifiedObjectMainProperties.certainty = 1.0;
            }

            classifiedObjectMainProperties.numberOfCoveringRules = abstractClassification.getIndicesOfCoveringRules()[classifiedObjectIndex].size();

            return classifiedObjectMainProperties;
        }
    }
}
