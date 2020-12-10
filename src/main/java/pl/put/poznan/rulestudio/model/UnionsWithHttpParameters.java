package pl.put.poznan.rulestudio.model;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.data.InformationTable;
import pl.put.poznan.rulestudio.enums.UnionType;

public class UnionsWithHttpParameters {
    private UnionsWithSingleLimitingDecision unions;
    private UnionType typeOfUnions;
    private Double consistencyThreshold;
    private String dataHash;
    private Boolean isCurrentData;
    private DescriptiveAttributes descriptiveAttributes;
    private InformationTable informationTable;

    public UnionsWithHttpParameters(UnionsWithSingleLimitingDecision unions, UnionType typeOfUnions, Double consistencyThreshold, String dataHash, String[] descriptiveAttributesPriority, InformationTable informationTable) {
        this.unions = unions;
        this.typeOfUnions = typeOfUnions;
        this.consistencyThreshold = consistencyThreshold;
        this.dataHash = dataHash;

        this.isCurrentData = true;
        this.descriptiveAttributes = new DescriptiveAttributes(informationTable, descriptiveAttributesPriority);
        this.informationTable = informationTable;
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

    public Boolean isCurrentData() {
        return isCurrentData;
    }

    public void setCurrentData(Boolean currentData) {
        isCurrentData = currentData;
    }

    public DescriptiveAttributes getDescriptiveAttributes() {
        return descriptiveAttributes;
    }

    public void setDescriptiveAttributes(DescriptiveAttributes descriptiveAttributes) {
        this.descriptiveAttributes = descriptiveAttributes;
    }

    public InformationTable getInformationTable() {
        return informationTable;
    }

    public void setInformationTable(InformationTable informationTable) {
        this.informationTable = informationTable;
    }

    @Override
    public String toString() {
        return "UnionsWithHttpParameters{" +
                "unions=" + unions +
                ", typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                ", dataHash='" + dataHash + '\'' +
                ", isCurrentData=" + isCurrentData +
                ", descriptiveAttributes=" + descriptiveAttributes +
                ", informationTable=" + informationTable +
                '}';
    }
}
