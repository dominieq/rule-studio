package pl.put.poznan.rulestudio.model.parameters;

import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;

public class ClassificationParametersImpl implements ClassificationParameters {

    private ClassifierType classifierType;

    private DefaultClassificationResultType defaultClassificationResultType;

    public ClassificationParametersImpl(ClassifierType classifierType, DefaultClassificationResultType defaultClassificationResultType) {
        this.classifierType = classifierType;
        this.defaultClassificationResultType = defaultClassificationResultType;
    }

    @Override
    public ClassifierType getClassifierType() {
        return classifierType;
    }

    @Override
    public DefaultClassificationResultType getDefaultClassificationResultType() {
        return defaultClassificationResultType;
    }

    @Override
    public String toString() {
        return "ClassificationParametersImpl{" +
                "classifierType=" + classifierType +
                ", defaultClassificationResultType=" + defaultClassificationResultType +
                '}';
    }
}
