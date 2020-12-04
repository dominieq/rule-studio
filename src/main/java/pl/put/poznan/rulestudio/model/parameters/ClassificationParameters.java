package pl.put.poznan.rulestudio.model.parameters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.model.ProjectClassification;

public class ClassificationParameters {

    private ClassifierType classifierType;

    private DefaultClassificationResultType defaultClassificationResultType;

    private ClassificationParameters() {
        //private constructor
    }

    public ClassifierType getClassifierType() {
        return classifierType;
    }

    public DefaultClassificationResultType getDefaultClassificationResultType() {
        return defaultClassificationResultType;
    }

    @Override
    public String toString() {
        return "ClassificationParameters{" +
                "classifierType=" + classifierType +
                ", defaultClassificationResultType=" + defaultClassificationResultType +
                '}';
    }

    public static class ClassificationParametersBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ClassificationParametersBuilder.class);

        private ClassifierType classifierType;
        private DefaultClassificationResultType defaultClassificationResultType;

        public static ClassificationParametersBuilder newInstance() {
            return new ClassificationParametersBuilder();
        }

        public ClassificationParametersBuilder setClassifierType(ClassifierType classifierType) {
            this.classifierType = classifierType;
            return this;
        }

        public ClassificationParametersBuilder setDefaultClassificationResultType(DefaultClassificationResultType defaultClassificationResultType) {
            this.defaultClassificationResultType = defaultClassificationResultType;
            return this;
        }

        public ClassificationParameters build() {
            ClassificationParameters classificationParameters = new ClassificationParameters();

            classificationParameters.classifierType = this.classifierType;
            classificationParameters.defaultClassificationResultType = this.defaultClassificationResultType;

            return classificationParameters;
        }

        public ClassificationParameters build(ProjectClassification projectClassification) {
            ClassificationParameters classificationParameters = new ClassificationParameters();

            classificationParameters.classifierType = projectClassification.getClassifierType();
            classificationParameters.defaultClassificationResultType = projectClassification.getDefaultClassificationResultType();

            return classificationParameters;
        }
    }
}
