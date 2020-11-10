package pl.put.poznan.rulestudio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import it.unimi.dsi.fastutil.ints.IntSortedSet;
import org.rulelearn.data.InformationTable;
import org.rulelearn.dominance.DominanceConeCalculator;

import java.util.Arrays;

public class DominanceCones {
    private int numberOfObjects;

    @JsonProperty("Positive dominance cone")
    private IntSortedSet[] positiveDCones;

    @JsonProperty("Negative dominance cone")
    private IntSortedSet[] negativeDCones;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("Positive inverse dominance cone")
    private IntSortedSet[] positiveInvDCones;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("Negative inverse dominance cone")
    private IntSortedSet[] negativeInvDCones;

    @JsonIgnore
    private String dataHash;

    @JsonProperty("isCurrentData")
    private Boolean isCurrentData;

    @JsonIgnore
    private DescriptiveAttributes descriptiveAttributes;

    public DominanceCones() {
        numberOfObjects = 0;

        this.positiveDCones = null;
        this.negativeDCones = null;
        this.positiveInvDCones = null;
        this.negativeInvDCones = null;

        this.dataHash = null;
        this.isCurrentData = null;
    }

    public DominanceCones(InformationTable informationTable) {
        calculateDCones(informationTable, null);
    }

    public int getNumberOfObjects() {
        return numberOfObjects;
    }

    public void setNumberOfObjects(int numberOfObjects) {
        this.numberOfObjects = numberOfObjects;
    }

    public IntSortedSet[] getPositiveDCones() {
        return positiveDCones;
    }

    public void setPositiveDCones(IntSortedSet[] positiveDCones) {
        this.positiveDCones = positiveDCones;
    }

    public IntSortedSet[] getNegativeDCones() {
        return negativeDCones;
    }

    public void setNegativeDCones(IntSortedSet[] negativeDCones) {
        this.negativeDCones = negativeDCones;
    }

    public IntSortedSet[] getPositiveInvDCones() {
        return positiveInvDCones;
    }

    public void setPositiveInvDCones(IntSortedSet[] positiveInvDCones) {
        this.positiveInvDCones = positiveInvDCones;
    }

    public IntSortedSet[] getNegativeInvDCones() {
        return negativeInvDCones;
    }

    public void setNegativeInvDCones(IntSortedSet[] negativeInvDCones) {
        this.negativeInvDCones = negativeInvDCones;
    }

    public String getDataHash() {
        return dataHash;
    }

    public void setDataHash(String dataHash) {
        this.dataHash = dataHash;
    }

    public DescriptiveAttributes getDescriptiveAttributes() {
        return descriptiveAttributes;
    }

    public void setDescriptiveAttributes(DescriptiveAttributes descriptiveAttributes) {
        this.descriptiveAttributes = descriptiveAttributes;
    }

    @JsonIgnore
    public boolean isCurrentData() {
        return isCurrentData;
    }

    public void setCurrentData(Boolean currentData) {
        isCurrentData = currentData;
    }

    @Override
    public String toString() {
        return "DominanceCones{" +
                "numberOfObjects=" + numberOfObjects +
                ", positiveDCones=" + Arrays.toString(positiveDCones) +
                ", negativeDCones=" + Arrays.toString(negativeDCones) +
                ", positiveInvDCones=" + Arrays.toString(positiveInvDCones) +
                ", negativeInvDCones=" + Arrays.toString(negativeInvDCones) +
                ", dataHash='" + dataHash + '\'' +
                ", isCurrentData=" + isCurrentData +
                '}';
    }

    public void calculateDCones(InformationTable informationTable, DescriptiveAttributes descriptiveAttributes) {
        this.numberOfObjects = informationTable.getNumberOfObjects();

        this.positiveDCones = new IntSortedSet[this.numberOfObjects];
        calculatePositiveDCones(informationTable);
        this.negativeDCones = new IntSortedSet[this.numberOfObjects];
        calculateNegativeDCones(informationTable);

        if(DominanceConeCalculator.INSTANCE.positiveDominanceConesEqual(informationTable)) {
            this.positiveInvDCones = null;
        } else {
            this.positiveInvDCones = new IntSortedSet[this.numberOfObjects];
            calculatePositiveInvDCones(informationTable);
        }

        if(DominanceConeCalculator.INSTANCE.negativeDominanceConesEqual(informationTable)) {
            this.negativeInvDCones = null;
        } else {
            this.negativeInvDCones = new IntSortedSet[this.numberOfObjects];
            calculateNegativeInvDCones(informationTable);
        }

        this.dataHash = informationTable.getHash();
        this.isCurrentData = true;
        this.descriptiveAttributes = new DescriptiveAttributes(descriptiveAttributes);
    }

    private void calculatePositiveDCones(InformationTable informationTable) {
        for(int x = 0; x < this.numberOfObjects; x++) {
            this.positiveDCones[x] = DominanceConeCalculator.INSTANCE.calculatePositiveDCone(x, informationTable);
        }
    }

    private void calculateNegativeDCones(InformationTable informationTable) {
        for(int x = 0; x < this.numberOfObjects; x++) {
            this.negativeDCones[x] = DominanceConeCalculator.INSTANCE.calculateNegativeDCone(x, informationTable);
        }
    }

    private void calculatePositiveInvDCones(InformationTable informationTable) {
        for(int x = 0; x < this.numberOfObjects; x++) {
            this.positiveInvDCones[x] = DominanceConeCalculator.INSTANCE.calculatePositiveInvDCone(x, informationTable);
        }
    }

    private void calculateNegativeInvDCones(InformationTable informationTable) {
        for(int x = 0; x < this.numberOfObjects; x++) {
            this.negativeInvDCones[x] = DominanceConeCalculator.INSTANCE.calculateNegativeInvDCone(x, informationTable);
        }
    }

}
