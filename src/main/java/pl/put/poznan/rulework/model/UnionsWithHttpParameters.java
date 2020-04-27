package pl.put.poznan.rulework.model;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import pl.put.poznan.rulework.enums.UnionType;

public class UnionsWithHttpParameters {
    private UnionsWithSingleLimitingDecision unions;
    private UnionType typeOfUnions;
    private Double consistencyThreshold;

    public UnionsWithHttpParameters(UnionsWithSingleLimitingDecision unions, UnionType typeOfUnions, Double consistencyThreshold) {
        this.unions = unions;
        this.typeOfUnions = typeOfUnions;
        this.consistencyThreshold = consistencyThreshold;
    }

    public UnionsWithSingleLimitingDecision getUnions() {
        return unions;
    }

    public void setUnions(UnionsWithSingleLimitingDecision unions) {
        this.unions = unions;
    }

    public UnionType getTypeOfUnions() {
        return typeOfUnions;
    }

    public void setTypeOfUnions(UnionType typeOfUnions) {
        this.typeOfUnions = typeOfUnions;
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
                ", typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                '}';
    }
}
