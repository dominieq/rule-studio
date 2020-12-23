package pl.put.poznan.rulestudio.model.parameters;

import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;

public interface ClassificationParameters {

    ClassifierType getClassifierType();

    DefaultClassificationResultType getDefaultClassificationResultType();

    Boolean equalsTo(ClassificationParameters that);
}
