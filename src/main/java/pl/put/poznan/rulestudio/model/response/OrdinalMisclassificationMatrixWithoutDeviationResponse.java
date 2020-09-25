package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.data.Decision;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;

public class OrdinalMisclassificationMatrixWithoutDeviationResponse {

    @JsonProperty("Accuracy")
    private Double accuracy;

    @JsonProperty("mae")
    private Double MAE;

    @JsonProperty("rmse")
    private Double RMSE;

    @JsonProperty("gmean")
    private Double Gmean;

    @JsonProperty("Number of correct assignments")
    private Double numberOfCorrectAssignments;

    @JsonProperty("Number of incorrect assignments")
    private Double numberOfIncorrectAssignments;

    @JsonProperty("Number of objects with assigned decision")
    private Double numberObjectsWithAssignedDecision;

    @JsonProperty("Number of unknown original decisions")
    private Double numberOfUnknownOriginalDecisions;

    @JsonProperty("Number of unknown assignments")
    private Double numberOfUnknownAssignments;

    @JsonProperty("Number of unknown assigned decisions for unknown original decisions")
    private Double numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;

    @JsonProperty("value")
    private Double[][] value;

    private OrdinalMisclassificationMatrixWithoutDeviationResponse() {
        //private constructor
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public Double getMAE() {
        return MAE;
    }

    public Double getRMSE() {
        return RMSE;
    }

    public Double getGmean() {
        return Gmean;
    }

    public Double getNumberOfCorrectAssignments() {
        return numberOfCorrectAssignments;
    }

    public Double getNumberOfIncorrectAssignments() {
        return numberOfIncorrectAssignments;
    }

    public Double getNumberObjectsWithAssignedDecision() {
        return numberObjectsWithAssignedDecision;
    }

    public Double getNumberOfUnknownOriginalDecisions() {
        return numberOfUnknownOriginalDecisions;
    }

    public Double getNumberOfUnknownAssignments() {
        return numberOfUnknownAssignments;
    }

    public Double getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions() {
        return numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
    }

    public Double[][] getValue() {
        return value;
    }

    @Override
    public String toString() {
        return "OrdinalMisclassificationMatrixWithoutDeviationResponse{" +
                "accuracy=" + accuracy +
                ", MAE=" + MAE +
                ", RMSE=" + RMSE +
                ", Gmean=" + Gmean +
                ", numberOfCorrectAssignments=" + numberOfCorrectAssignments +
                ", numberOfIncorrectAssignments=" + numberOfIncorrectAssignments +
                ", numberObjectsWithAssignedDecision=" + numberObjectsWithAssignedDecision +
                ", numberOfUnknownOriginalDecisions=" + numberOfUnknownOriginalDecisions +
                ", numberOfUnknownAssignments=" + numberOfUnknownAssignments +
                ", numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions=" + numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions +
                ", value=" + Arrays.toString(value) +
                '}';
    }

    public static class OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(OrdinalMisclassificationMatrixResponse.OrdinalMisclassificationMatrixResponseBuilder.class);

        private Double accuracy;
        private Double MAE;
        private Double RMSE;
        private Double Gmean;
        private Double numberOfCorrectAssignments;
        private Double numberOfIncorrectAssignments;
        private Double numberObjectsWithAssignedDecision;
        private Double numberOfUnknownOriginalDecisions;
        private Double numberOfUnknownAssignments;
        private Double numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
        private Double[][] value;

        public static OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder newInstance() {
            return new OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder();
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setAccuracy(Double accuracy) {
            this.accuracy = accuracy;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setMAE(Double MAE) {
            this.MAE = MAE;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setRMSE(Double RMSE) {
            this.RMSE = RMSE;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setGmean(Double gmean) {
            Gmean = gmean;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setNumberOfCorrectAssignments(Double numberOfCorrectAssignments) {
            this.numberOfCorrectAssignments = numberOfCorrectAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setNumberOfIncorrectAssignments(Double numberOfIncorrectAssignments) {
            this.numberOfIncorrectAssignments = numberOfIncorrectAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setNumberObjectsWithAssignedDecision(Double numberObjectsWithAssignedDecision) {
            this.numberObjectsWithAssignedDecision = numberObjectsWithAssignedDecision;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setNumberOfUnknownOriginalDecisions(Double numberOfUnknownOriginalDecisions) {
            this.numberOfUnknownOriginalDecisions = numberOfUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setNumberOfUnknownAssignments(Double numberOfUnknownAssignments) {
            this.numberOfUnknownAssignments = numberOfUnknownAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions(Double numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions) {
            this.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setValue(Double[][] value) {
            this.value = value;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponse build() {
            OrdinalMisclassificationMatrixWithoutDeviationResponse ommwdr = new OrdinalMisclassificationMatrixWithoutDeviationResponse();

            ommwdr.accuracy = this.accuracy;
            ommwdr.MAE = this.MAE;
            ommwdr.RMSE = this.RMSE;
            ommwdr.Gmean = this.Gmean;
            ommwdr.numberOfCorrectAssignments = this.numberOfCorrectAssignments;
            ommwdr.numberOfIncorrectAssignments = this.numberOfIncorrectAssignments;
            ommwdr.numberObjectsWithAssignedDecision = this.numberObjectsWithAssignedDecision;
            ommwdr.numberOfUnknownOriginalDecisions = this.numberOfUnknownOriginalDecisions;
            ommwdr.numberOfUnknownAssignments = this.numberOfUnknownAssignments;
            ommwdr.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = this.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
            ommwdr.value = this.value;

            return ommwdr;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponse build(OrdinalMisclassificationMatrix matrix, Decision[] orderOfDecisions) {
            OrdinalMisclassificationMatrixWithoutDeviationResponse ommwdr = new OrdinalMisclassificationMatrixWithoutDeviationResponse();

            ommwdr.accuracy = matrix.getAccuracy();
            ommwdr.MAE = matrix.getMAE();
            ommwdr.RMSE = matrix.getRMSE();
            ommwdr.Gmean = matrix.getGmean();
            ommwdr.numberOfCorrectAssignments = matrix.getNumberOfCorrectAssignments();
            ommwdr.numberOfIncorrectAssignments = matrix.getNumberOfIncorrectAssignments();
            ommwdr.numberObjectsWithAssignedDecision = matrix.getNumberObjectsWithAssignedDecision();
            ommwdr.numberOfUnknownOriginalDecisions = matrix.getNumberOfUnknownOriginalDecisions();
            ommwdr.numberOfUnknownAssignments = matrix.getNumberOfUnknownAssignments();
            ommwdr.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = matrix.getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions();

            final int numberOfDecision = orderOfDecisions.length;
            int row, col;
            Decision originalDecision, assignedDecision;

            ommwdr.value = new Double[numberOfDecision][];
            for(row = 0; row < numberOfDecision; row++) {
                originalDecision = orderOfDecisions[row];
                ommwdr.value[row] = new Double[numberOfDecision];

                for(col = 0; col < numberOfDecision; col++) {
                    assignedDecision = orderOfDecisions[col];
                    ommwdr.value[row][col] = matrix.getValue(originalDecision, assignedDecision);
                }
            }

            return ommwdr;
        }
    }
}
