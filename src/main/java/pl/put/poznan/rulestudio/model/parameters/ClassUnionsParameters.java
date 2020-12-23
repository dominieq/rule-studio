package pl.put.poznan.rulestudio.model.parameters;

import pl.put.poznan.rulestudio.enums.UnionType;

public interface ClassUnionsParameters {

    UnionType getTypeOfUnions();

    Double getConsistencyThreshold();

    Boolean equalsTo(ClassUnionsParameters that);
}
