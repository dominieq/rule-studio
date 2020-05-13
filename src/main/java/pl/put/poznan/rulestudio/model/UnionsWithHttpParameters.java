package pl.put.poznan.rulestudio.model;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import pl.put.poznan.rulestudio.enums.UnionType;

public class UnionsWithHttpParameters {
    private UnionsWithSingleLimitingDecision unions;
    private UnionType typeOfUnions;
    private Double consistencyThreshold;
    private String dataHash;

    public UnionsWithHttpParameters(UnionsWithSingleLimitingDecision unions, UnionType typeOfUnions, Double consistencyThreshold, String dataHash) {
        this.unions = unions;
        this.typeOfUnions = typeOfUnions;
        this.consistencyThreshold = consistencyThreshold;
        this.dataHash = dataHash;
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

    public String getDataHash() {
        return dataHash;
    }

    public void setDataHash(String dataHash) {
        this.dataHash = dataHash;
    }

    @Override
    public String toString() {
        return "UnionsWithHttpParameters{" +
                "unions=" + unions +
                ", typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                ", dataHash='" + dataHash + '\'' +
                '}';
    }
}
