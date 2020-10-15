package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import it.unimi.dsi.fastutil.ints.IntSortedSet;
import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.DominanceCones;

import java.util.Arrays;

public class MainDominanceConesResponse {

    private int numberOfObjects;

    @JsonProperty("isCurrentData")
    private Boolean isCurrentData;

    @JsonProperty("positiveDominanceCones")
    private int[] positiveDominanceConeCounts;

    @JsonProperty("negativeDominanceCones")
    private int[] negativeDominanceConeCounts;

    @JsonProperty("positiveInverseDominanceCones")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private int[] positiveInverseDominanceConeCounts;

    @JsonProperty("negativeInverseDominanceCones")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private int[] negativeInverseDominanceConeCounts;

    private String[] objectNames;

    private MainDominanceConesResponse() {
        //private constructor
    }

    public int getNumberOfObjects() {
        return numberOfObjects;
    }

    @JsonIgnore
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

    public String[] getObjectNames() {
        return objectNames;
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
                ", objectNames=" + Arrays.toString(objectNames) +
                '}';
    }

    public static class MainDominanceConesResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(MainDominanceConesResponseBuilder.class);

        private int numberOfObjects;
        private Boolean isCurrentData;
        private int[] positiveDominanceConeCounts;
        private int[] negativeDominanceConeCounts;
        private int[] positiveInverseDominanceConeCounts;
        private int[] negativeInverseDominanceConeCounts;
        private String[] objectNames;

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

        public MainDominanceConesResponseBuilder setObjectNames(String[] objectNames) {
            this.objectNames = objectNames;
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
            mainDominanceConesResponse.objectNames = this.objectNames;

            return mainDominanceConesResponse;
        }

        private int[] createDominanceConeCountsArray(int numberOfObjects, IntSortedSet[] dominanceConeSets) {
            int[] dominanceConeCounts = new int[numberOfObjects];
            for(int index = 0; index < numberOfObjects; index++) {
                dominanceConeCounts[index] = dominanceConeSets[index].size();
            }

            return dominanceConeCounts;
        }

        public MainDominanceConesResponse build(DominanceCones dominanceCones, InformationTable informationTable) {
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

            mainDominanceConesResponse.objectNames = dominanceCones.getDescriptiveAttributes().extractObjectNames(informationTable);

            return mainDominanceConesResponse;
        }
    }
}
