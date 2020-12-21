package pl.put.poznan.rulestudio.model.parameters;

import pl.put.poznan.rulestudio.enums.UnionType;

public class ClassUnionsParametersImpl implements ClassUnionsParameters {

    private UnionType typeOfUnions;

    private Double consistencyThreshold;

    public ClassUnionsParametersImpl(UnionType typeOfUnions, Double consistencyThreshold) {
        this.typeOfUnions = typeOfUnions;
        this.consistencyThreshold = consistencyThreshold;
    }

    @Override
    public UnionType getTypeOfUnions() {
        return typeOfUnions;
    }

    @Override
    public Double getConsistencyThreshold() {
        return consistencyThreshold;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ClassUnionsParametersImpl)) return false;
        ClassUnionsParametersImpl that = (ClassUnionsParametersImpl) o;
        return getTypeOfUnions() == that.getTypeOfUnions() &&
                getConsistencyThreshold().equals(that.getConsistencyThreshold());
    }

    @Override
    public String toString() {
        return "ClassUnionsParametersImpl{" +
                "typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                '}';
    }
}
