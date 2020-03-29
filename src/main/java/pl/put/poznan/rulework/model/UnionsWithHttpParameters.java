package pl.put.poznan.rulework.model;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import pl.put.poznan.rulework.enums.UnionType;

public class UnionsWithHttpParameters {
    private UnionsWithSingleLimitingDecision unions;
    private UnionType typeOfUnion;
    private Double consistencyThreshold;

    public UnionsWithHttpParameters(UnionsWithSingleLimitingDecision unions, UnionType typeOfUnion, Double consistencyThreshold) {
        this.unions = unions;
        this.typeOfUnion = typeOfUnion;
        this.consistencyThreshold = consistencyThreshold;
    }

    public UnionsWithSingleLimitingDecision getUnions() {
        return unions;
    }

    public void setUnions(UnionsWithSingleLimitingDecision unions) {
        this.unions = unions;
    }

    public UnionType getTypeOfUnion() {
        return typeOfUnion;
    }

    public void setTypeOfUnion(UnionType typeOfUnion) {
        this.typeOfUnion = typeOfUnion;
    }

    public Double getConsistencyThreshold() {
        return consistencyThreshold;
    }

    public void setConsistencyThreshold(Double consistencyThreshold) {
        this.consistencyThreshold = consistencyThreshold;
    }

    @Override
    public String toString() {
        return "UnionsWithHttpParameters{" +
                "unions=" + unions +
                ", typeOfUnion=" + typeOfUnion +
                ", consistencyThreshold=" + consistencyThreshold +
                '}';
    }
}
