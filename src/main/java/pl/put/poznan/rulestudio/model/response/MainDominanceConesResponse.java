package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import it.unimi.dsi.fastutil.ints.IntSortedSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.DominanceCones;

import java.util.Arrays;

public class MainDominanceConesResponse {

    private static final Logger logger = LoggerFactory.getLogger(MainDominanceConesResponse.class);

    private int numberOfObjects;

    @JsonProperty("isCurrentData")
    private Boolean isCurrentData;

    private int[] positiveDominanceConeCounts;

    private int[] negativeDominanceConeCounts;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private int[] positiveInverseDominanceConeCounts;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private int[] negativeInverseDominanceConeCounts;

    private MainDominanceConesResponse() {
        //empty constructor
    }

    public int getNumberOfObjects() {
        return numberOfObjects;
    }

    public Boolean getCurrentData() {
        return isCurrentData;
    }

    public int[] getPositiveDominanceConeCounts() {
        return positiveDominanceConeCounts;
    }

    public int[] getNegativeDominanceConeCounts() {
        return negativeDominanceConeCounts;
    }

    public int[] getPositiveInverseDominanceConeCounts() {
        return positiveInverseDominanceConeCounts;
    }

    public int[] getNegativeInverseDominanceConeCounts() {
        return negativeInverseDominanceConeCounts;
    }

    @Override
    public String toString() {
        return "MainDominanceConesResponse{" +
                "numberOfObjects=" + numberOfObjects +
                ", isCurrentData=" + isCurrentData +
                ", positiveDominanceConeCounts=" + Arrays.toString(positiveDominanceConeCounts) +
                ", negativeDominanceConeCounts=" + Arrays.toString(negativeDominanceConeCounts) +
                ", positiveInverseDominanceConeCounts=" + Arrays.toString(positiveInverseDominanceConeCounts) +
                ", negativeInverseDominanceConeCounts=" + Arrays.toString(negativeInverseDominanceConeCounts) +
                '}';
    }

    public static class MainDominanceConesResponseBuilder {
        private int numberOfObjects;
        private Boolean isCurrentData;
        private int[] positiveDominanceConeCounts;
        private int[] negativeDominanceConeCounts;
        private int[] positiveInverseDominanceConeCounts;
        private int[] negativeInverseDominanceConeCounts;

        public static MainDominanceConesResponseBuilder newInstance() {
            return new MainDominanceConesResponseBuilder();
        }

        public MainDominanceConesResponseBuilder setNumberOfObjects(int numberOfObjects) {
            this.numberOfObjects = numberOfObjects;
            return this;
        }

        public MainDominanceConesResponseBuilder setCurrentData(Boolean currentData) {
            isCurrentData = currentData;
            return this;
        }

        public MainDominanceConesResponseBuilder setPositiveDominanceConeCounts(int[] positiveDominanceConeCounts) {
            this.positiveDominanceConeCounts = positiveDominanceConeCounts;
            return this;
        }

        public MainDominanceConesResponseBuilder setNegativeDominanceConeCounts(int[] negativeDominanceConeCounts) {
            this.negativeDominanceConeCounts = negativeDominanceConeCounts;
            return this;
        }

        public MainDominanceConesResponseBuilder setPositiveInverseDominanceConeCounts(int[] positiveInverseDominanceConeCounts) {
            this.positiveInverseDominanceConeCounts = positiveInverseDominanceConeCounts;
            return this;
        }

        public MainDominanceConesResponseBuilder setNegativeInverseDominanceConeCounts(int[] negativeInverseDominanceConeCounts) {
            this.negativeInverseDominanceConeCounts = negativeInverseDominanceConeCounts;
            return this;
        }

        public MainDominanceConesResponse build() {
            MainDominanceConesResponse mainDominanceConesResponse = new MainDominanceConesResponse();

            mainDominanceConesResponse.numberOfObjects = this.numberOfObjects;
            mainDominanceConesResponse.isCurrentData = this.isCurrentData;
            mainDominanceConesResponse.positiveDominanceConeCounts = this.positiveDominanceConeCounts;
            mainDominanceConesResponse.negativeDominanceConeCounts = this.negativeDominanceConeCounts;
            mainDominanceConesResponse.positiveInverseDominanceConeCounts = this.positiveInverseDominanceConeCounts;
            mainDominanceConesResponse.negativeInverseDominanceConeCounts = this.negativeInverseDominanceConeCounts;

            return mainDominanceConesResponse;
        }

        private int[] createDominanceConeCountsArray(int numberOfObjects, IntSortedSet[] dominanceConeSets) {
            int[] dominanceConeCounts = new int[numberOfObjects];
            for(int index = 0; index < numberOfObjects; index++) {
                dominanceConeCounts[index] = dominanceConeSets[index].size();
            }

            return dominanceConeCounts;
        }

        public MainDominanceConesResponse build(DominanceCones dominanceCones) {
            MainDominanceConesResponse mainDominanceConesResponse = new MainDominanceConesResponse();

            mainDominanceConesResponse.numberOfObjects = dominanceCones.getNumberOfObjects();
            mainDominanceConesResponse.isCurrentData = dominanceCones.isCurrentData();

            mainDominanceConesResponse.positiveDominanceConeCounts = createDominanceConeCountsArray(mainDominanceConesResponse.numberOfObjects, dominanceCones.getPositiveDCones());
            mainDominanceConesResponse.negativeDominanceConeCounts = createDominanceConeCountsArray(mainDominanceConesResponse.numberOfObjects, dominanceCones.getNegativeDCones());

            if(dominanceCones.getPositiveInvDCones() != null) {
                mainDominanceConesResponse.positiveInverseDominanceConeCounts = createDominanceConeCountsArray(mainDominanceConesResponse.numberOfObjects, dominanceCones.getPositiveInvDCones());
            } else {
                mainDominanceConesResponse.positiveInverseDominanceConeCounts = null;
            }

            if(dominanceCones.getNegativeInvDCones() != null) {
                mainDominanceConesResponse.negativeInverseDominanceConeCounts = createDominanceConeCountsArray(mainDominanceConesResponse.numberOfObjects, dominanceCones.getNegativeInvDCones());
            } else {
                mainDominanceConesResponse.negativeInverseDominanceConeCounts = null;
            }

            return mainDominanceConesResponse;
        }
    }
}
