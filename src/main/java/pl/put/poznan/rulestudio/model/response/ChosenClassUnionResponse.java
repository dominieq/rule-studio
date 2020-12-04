package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.approximations.Union;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ChosenClassUnionResponse {

    @JsonProperty("Objects")
    private Integer objectsCount;

    @JsonProperty("Lower approximation")
    private Integer lowerApproximationCount;

    @JsonProperty("Upper approximation")
    private Integer upperApproximationCount;

    @JsonProperty("Boundary")
    private Integer boundaryCount;

    @JsonProperty("Positive region")
    private Integer positiveRegionCount;

    @JsonProperty("Negative region")
    private Integer negativeRegionCount;

    @JsonProperty("Boundary region")
    private Integer boundaryRegionCount;

    private ChosenClassUnionResponse() {
        //private constructor
    }

    public Integer getObjectsCount() {
        return objectsCount;
    }

    public Integer getLowerApproximationCount() {
        return lowerApproximationCount;
    }

    public Integer getUpperApproximationCount() {
        return upperApproximationCount;
    }

    public Integer getBoundaryCount() {
        return boundaryCount;
    }

    public Integer getPositiveRegionCount() {
        return positiveRegionCount;
    }

    public Integer getNegativeRegionCount() {
        return negativeRegionCount;
    }

    public Integer getBoundaryRegionCount() {
        return boundaryRegionCount;
    }

    @Override
    public String toString() {
        return "ChosenClassUnionResponse{" +
                "objectsCount=" + objectsCount +
                ", lowerApproximationCount=" + lowerApproximationCount +
                ", upperApproximationCount=" + upperApproximationCount +
                ", boundaryCount=" + boundaryCount +
                ", positiveRegionCount=" + positiveRegionCount +
                ", negativeRegionCount=" + negativeRegionCount +
                ", boundaryRegionCount=" + boundaryRegionCount +
                '}';
    }

    public static class ChosenClassUnionResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ChosenClassUnionResponseBuilder.class);

        private Integer objectsCount;
        private Integer lowerApproximationCount;
        private Integer upperApproximationCount;
        private Integer boundaryCount;
        private Integer positiveRegionCount;
        private Integer negativeRegionCount;
        private Integer boundaryRegionCount;

        public static ChosenClassUnionResponseBuilder newInstance() {
            return new ChosenClassUnionResponseBuilder();
        }

        public ChosenClassUnionResponseBuilder setObjectsCount(Integer objectsCount) {
            this.objectsCount = objectsCount;
            return this;
        }

        public ChosenClassUnionResponseBuilder setLowerApproximationCount(Integer lowerApproximationCount) {
            this.lowerApproximationCount = lowerApproximationCount;
            return this;
        }

        public ChosenClassUnionResponseBuilder setUpperApproximationCount(Integer upperApproximationCount) {
            this.upperApproximationCount = upperApproximationCount;
            return this;
        }

        public ChosenClassUnionResponseBuilder setBoundaryCount(Integer boundaryCount) {
            this.boundaryCount = boundaryCount;
            return this;
        }

        public ChosenClassUnionResponseBuilder setPositiveRegionCount(Integer positiveRegionCount) {
            this.positiveRegionCount = positiveRegionCount;
            return this;
        }

        public ChosenClassUnionResponseBuilder setNegativeRegionCount(Integer negativeRegionCount) {
            this.negativeRegionCount = negativeRegionCount;
            return this;
        }

        public ChosenClassUnionResponseBuilder setBoundaryRegionCount(Integer boundaryRegionCount) {
            this.boundaryRegionCount = boundaryRegionCount;
            return this;
        }

        public ChosenClassUnionResponse build() {
            ChosenClassUnionResponse chosenClassUnionResponse = new ChosenClassUnionResponse();

            chosenClassUnionResponse.objectsCount = this.objectsCount;
            chosenClassUnionResponse.lowerApproximationCount = this.lowerApproximationCount;
            chosenClassUnionResponse.upperApproximationCount = this.upperApproximationCount;
            chosenClassUnionResponse.boundaryCount = this.boundaryCount;
            chosenClassUnionResponse.positiveRegionCount = this.positiveRegionCount;
            chosenClassUnionResponse.negativeRegionCount = this.negativeRegionCount;
            chosenClassUnionResponse.boundaryRegionCount = this.boundaryRegionCount;

            return chosenClassUnionResponse;
        }

        public ChosenClassUnionResponse build(Union union) {
            ChosenClassUnionResponse chosenClassUnionResponse = new ChosenClassUnionResponse();

            chosenClassUnionResponse.objectsCount = union.getObjects().size();
            chosenClassUnionResponse.lowerApproximationCount = union.getLowerApproximation().size();
            chosenClassUnionResponse.upperApproximationCount = union.getUpperApproximation().size();
            chosenClassUnionResponse.boundaryCount = union.getBoundary().size();
            chosenClassUnionResponse.positiveRegionCount = union.getPositiveRegion().size();
            chosenClassUnionResponse.negativeRegionCount = union.getNegativeRegion().size();
            chosenClassUnionResponse.boundaryRegionCount = union.getBoundaryRegion().size();

            return chosenClassUnionResponse;
        }
    }
}
