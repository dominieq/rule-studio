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
    public Boolean equalsTo(ClassUnionsParameters that) {
        if (that == null) return false;
        return this.getTypeOfUnions() == that.getTypeOfUnions() &&
                this.getConsistencyThreshold().equals(that.getConsistencyThreshold());
    }

    @Override
    public String toString() {
        return "ClassUnionsParametersImpl{" +
                "typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                '}';
    }
}
