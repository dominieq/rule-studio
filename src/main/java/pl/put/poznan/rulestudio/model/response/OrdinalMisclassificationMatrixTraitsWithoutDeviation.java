package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@JsonPropertyOrder({"Accuracy", "mae", "rmse", "gmean",
        "Number of correct assignments",
        "Number of incorrect assignments",
        "Number of objects with assigned decision",
        "Number of unknown original decisions",
        "Number of unknown assignments",
        "Number of unknown assigned decisions for unknown original decisions"})
public class OrdinalMisclassificationMatrixTraitsWithoutDeviation {

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

    private OrdinalMisclassificationMatrixTraitsWithoutDeviation() {
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

    @Override
    public String toString() {
        return "OrdinalMisclassificationMatrixTraitsWithoutDeviation{" +
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
                '}';
    }

    public static class OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder {
        private static final Logger logger = LoggerFactory.getLogger(OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder.class);

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

        public static OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder newInstance() {
            return new OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder();
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder setAccuracy(Double accuracy) {
            this.accuracy = accuracy;
            return this;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder setMAE(Double MAE) {
            this.MAE = MAE;
            return this;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder setRMSE(Double RMSE) {
            this.RMSE = RMSE;
            return this;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder setGmean(Double gmean) {
            Gmean = gmean;
            return this;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder setNumberOfCorrectAssignments(Double numberOfCorrectAssignments) {
            this.numberOfCorrectAssignments = numberOfCorrectAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder setNumberOfIncorrectAssignments(Double numberOfIncorrectAssignments) {
            this.numberOfIncorrectAssignments = numberOfIncorrectAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder setNumberObjectsWithAssignedDecision(Double numberObjectsWithAssignedDecision) {
            this.numberObjectsWithAssignedDecision = numberObjectsWithAssignedDecision;
            return this;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder setNumberOfUnknownOriginalDecisions(Double numberOfUnknownOriginalDecisions) {
            this.numberOfUnknownOriginalDecisions = numberOfUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder setNumberOfUnknownAssignments(Double numberOfUnknownAssignments) {
            this.numberOfUnknownAssignments = numberOfUnknownAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder setNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions(Double numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions) {
            this.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviation build() {
            OrdinalMisclassificationMatrixTraitsWithoutDeviation ommtwd = new OrdinalMisclassificationMatrixTraitsWithoutDeviation();

            ommtwd.accuracy = this.accuracy;
            ommtwd.MAE = this.MAE;
            ommtwd.RMSE = this.RMSE;
            ommtwd.Gmean = this.Gmean;
            ommtwd.numberOfCorrectAssignments = this.numberOfCorrectAssignments;
            ommtwd.numberOfIncorrectAssignments = this.numberOfIncorrectAssignments;
            ommtwd.numberObjectsWithAssignedDecision = this.numberObjectsWithAssignedDecision;
            ommtwd.numberOfUnknownOriginalDecisions = this.numberOfUnknownOriginalDecisions;
            ommtwd.numberOfUnknownAssignments = this.numberOfUnknownAssignments;
            ommtwd.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = this.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;

            return ommtwd;
        }

        public OrdinalMisclassificationMatrixTraitsWithoutDeviation build(OrdinalMisclassificationMatrix matrix) {
            OrdinalMisclassificationMatrixTraitsWithoutDeviation ommtwd = new OrdinalMisclassificationMatrixTraitsWithoutDeviation();

            ommtwd.accuracy = matrix.getAccuracy();
            ommtwd.MAE = matrix.getMAE();
            ommtwd.RMSE = matrix.getRMSE();
            ommtwd.Gmean = matrix.getGmean();
            ommtwd.numberOfCorrectAssignments = matrix.getNumberOfCorrectAssignments();
            ommtwd.numberOfIncorrectAssignments = matrix.getNumberOfIncorrectAssignments();
            ommtwd.numberObjectsWithAssignedDecision = matrix.getNumberObjectsWithAssignedDecision();
            ommtwd.numberOfUnknownOriginalDecisions = matrix.getNumberOfUnknownOriginalDecisions();
            ommtwd.numberOfUnknownAssignments = matrix.getNumberOfUnknownAssignments();
            ommtwd.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = matrix.getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions();

            return ommtwd;
        }
    }
}
