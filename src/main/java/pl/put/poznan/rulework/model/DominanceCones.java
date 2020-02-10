package pl.put.poznan.rulework.model;

import it.unimi.dsi.fastutil.ints.IntSortedSet;
import org.rulelearn.data.InformationTable;
import org.rulelearn.dominance.DominanceConeCalculator;

import java.util.Arrays;

public class DominanceCones {
    private int numberOfObjects;
    private IntSortedSet[] positiveDCones;
    private IntSortedSet[] negativeDCones;
    private IntSortedSet[] positiveInvDCones;
    private IntSortedSet[] negativeInvDCones;

    public DominanceCones() {
        numberOfObjects = 0;

        this.positiveDCones = null;
        this.negativeDCones = null;
        this.positiveInvDCones = null;
        this.negativeInvDCones = null;
    }

    public DominanceCones(InformationTable informationTable) {
        calculateDCones(informationTable);
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

    @Override
    public String toString() {
        return "DominanceCones{" +
                "numberOfObjects=" + numberOfObjects +
                ", positiveDCones=" + Arrays.toString(positiveDCones) +
                ", negativeDCones=" + Arrays.toString(negativeDCones) +
                ", positiveInvDCones=" + Arrays.toString(positiveInvDCones) +
                ", negativeInvDCones=" + Arrays.toString(negativeInvDCones) +
                '}';
    }

    public void calculateDCones(InformationTable informationTable) {
        this.numberOfObjects = informationTable.getNumberOfObjects();

        this.positiveDCones = new IntSortedSet[this.numberOfObjects];
        this.negativeDCones = new IntSortedSet[this.numberOfObjects];
        this.positiveInvDCones = new IntSortedSet[this.numberOfObjects];
        this.negativeInvDCones = new IntSortedSet[this.numberOfObjects];

        calculatePositiveDCones(informationTable);
        calculateNegativeDCones(informationTable);
        calculatePositiveInvDCones(informationTable);
        calculateNegativeInvDCones(informationTable);
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
