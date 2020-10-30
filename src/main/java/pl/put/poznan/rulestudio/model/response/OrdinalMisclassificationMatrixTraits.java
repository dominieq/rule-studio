package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@JsonPropertyOrder({"Accuracy", "Deviation of accuracy",
        "mae", "rmse", "gmean",
        "Number of correct assignments", "Deviation of number of correct assignments",
        "Number of incorrect assignments", "Deviation of number of incorrect assignments",
        "Number of objects with assigned decision", "Deviation of number objects with assigned decision",
        "Number of unknown original decisions", "Deviation of number of unknown original decisions",
        "Number of unknown assignments", "Deviation of number of unknown assignments",
        "Number of unknown assigned decisions for unknown original decisions", "Deviation of number of unknown assigned decisions for unknown original decisions"})
public class OrdinalMisclassificationMatrixTraits {

    @JsonProperty("Accuracy")
    private Double accuracy;

    @JsonProperty("Deviation of accuracy")
    private Double deviationOfAccuracy;

    @JsonProperty("mae")
    private Double MAE;

    @JsonProperty("rmse")
    private Double RMSE;

    @JsonProperty("gmean")
    private Double Gmean;

    @JsonProperty("Number of correct assignments")
    private Double  numberOfCorrectAssignments;

    @JsonProperty("Deviation of number of correct assignments")
    private Double deviationOfNumberOfCorrectAssignments;

    @JsonProperty("Number of incorrect assignments")
    private Double numberOfIncorrectAssignments;

    @JsonProperty("Deviation of number of incorrect assignments")
    private Double deviationOfNumberOfIncorrectAssignments;

    @JsonProperty("Number of objects with assigned decision")
    private Double numberObjectsWithAssignedDecision;

    @JsonProperty("Deviation of number objects with assigned decision")
    private Double deviationOfNumberObjectsWithAssignedDecision;

    @JsonProperty("Number of unknown original decisions")
    private Double numberOfUnknownOriginalDecisions;

    @JsonProperty("Deviation of number of unknown original decisions")
    private Double deviationOfNumberOfUnknownOriginalDecisions;

    @JsonProperty("Number of unknown assignments")
    private Double numberOfUnknownAssignments;

    @JsonProperty("Deviation of number of unknown assignments")
    private Double deviationOfNumberOfUnknownAssignments;

    @JsonProperty("Number of unknown assigned decisions for unknown original decisions")
    private Double numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;

    @JsonProperty("Deviation of number of unknown assigned decisions for unknown original decisions")
    private Double deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;

    private OrdinalMisclassificationMatrixTraits() {
        //private constructor
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public Double getDeviationOfAccuracy() {
        return deviationOfAccuracy;
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

    public Double getDeviationOfNumberOfCorrectAssignments() {
        return deviationOfNumberOfCorrectAssignments;
    }

    public Double getNumberOfIncorrectAssignments() {
        return numberOfIncorrectAssignments;
    }

    public Double getDeviationOfNumberOfIncorrectAssignments() {
        return deviationOfNumberOfIncorrectAssignments;
    }

    public Double getNumberObjectsWithAssignedDecision() {
        return numberObjectsWithAssignedDecision;
    }

    public Double getDeviationOfNumberObjectsWithAssignedDecision() {
        return deviationOfNumberObjectsWithAssignedDecision;
    }

    public Double getNumberOfUnknownOriginalDecisions() {
        return numberOfUnknownOriginalDecisions;
    }

    public Double getDeviationOfNumberOfUnknownOriginalDecisions() {
        return deviationOfNumberOfUnknownOriginalDecisions;
    }

    public Double getNumberOfUnknownAssignments() {
        return numberOfUnknownAssignments;
    }

    public Double getDeviationOfNumberOfUnknownAssignments() {
        return deviationOfNumberOfUnknownAssignments;
    }

    public Double getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions() {
        return numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
    }

    public Double getDeviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions() {
        return deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
    }

    @Override
    public String toString() {
        return "OrdinalMisclassificationMatrixTraits{" +
                "accuracy=" + accuracy +
                ", deviationOfAccuracy=" + deviationOfAccuracy +
                ", MAE=" + MAE +
                ", RMSE=" + RMSE +
                ", Gmean=" + Gmean +
                ", numberOfCorrectAssignments=" + numberOfCorrectAssignments +
                ", deviationOfNumberOfCorrectAssignments=" + deviationOfNumberOfCorrectAssignments +
                ", numberOfIncorrectAssignments=" + numberOfIncorrectAssignments +
                ", deviationOfNumberOfIncorrectAssignments=" + deviationOfNumberOfIncorrectAssignments +
                ", numberObjectsWithAssignedDecision=" + numberObjectsWithAssignedDecision +
                ", deviationOfNumberObjectsWithAssignedDecision=" + deviationOfNumberObjectsWithAssignedDecision +
                ", numberOfUnknownOriginalDecisions=" + numberOfUnknownOriginalDecisions +
                ", deviationOfNumberOfUnknownOriginalDecisions=" + deviationOfNumberOfUnknownOriginalDecisions +
                ", numberOfUnknownAssignments=" + numberOfUnknownAssignments +
                ", deviationOfNumberOfUnknownAssignments=" + deviationOfNumberOfUnknownAssignments +
                ", numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions=" + numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions +
                ", deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions=" + deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions +
                '}';
    }

    public static class OrdinalMisClassificationMatrixTraitsBuilder {
        private static final Logger logger = LoggerFactory.getLogger(OrdinalMisClassificationMatrixTraitsBuilder.class);

        private Double accuracy;
        private Double deviationOfAccuracy;
        private Double MAE;
        private Double RMSE;
        private Double Gmean;
        private Double numberOfCorrectAssignments;
        private Double deviationOfNumberOfCorrectAssignments;
        private Double numberOfIncorrectAssignments;
        private Double deviationOfNumberOfIncorrectAssignments;
        private Double numberObjectsWithAssignedDecision;
        private Double deviationOfNumberObjectsWithAssignedDecision;
        private Double numberOfUnknownOriginalDecisions;
        private Double deviationOfNumberOfUnknownOriginalDecisions;
        private Double numberOfUnknownAssignments;
        private Double deviationOfNumberOfUnknownAssignments;
        private Double numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
        private Double deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;

        public static OrdinalMisClassificationMatrixTraitsBuilder newInstance() {
            return new OrdinalMisClassificationMatrixTraitsBuilder();
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setAccuracy(Double accuracy) {
            this.accuracy = accuracy;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setDeviationOfAccuracy(Double deviationOfAccuracy) {
            this.deviationOfAccuracy = deviationOfAccuracy;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setMAE(Double MAE) {
            this.MAE = MAE;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setRMSE(Double RMSE) {
            this.RMSE = RMSE;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setGmean(Double gmean) {
            Gmean = gmean;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setNumberOfCorrectAssignments(Double numberOfCorrectAssignments) {
            this.numberOfCorrectAssignments = numberOfCorrectAssignments;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setDeviationOfNumberOfCorrectAssignments(Double deviationOfNumberOfCorrectAssignments) {
            this.deviationOfNumberOfCorrectAssignments = deviationOfNumberOfCorrectAssignments;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setNumberOfIncorrectAssignments(Double numberOfIncorrectAssignments) {
            this.numberOfIncorrectAssignments = numberOfIncorrectAssignments;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setDeviationOfNumberOfIncorrectAssignments(Double deviationOfNumberOfIncorrectAssignments) {
            this.deviationOfNumberOfIncorrectAssignments = deviationOfNumberOfIncorrectAssignments;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setNumberObjectsWithAssignedDecision(Double numberObjectsWithAssignedDecision) {
            this.numberObjectsWithAssignedDecision = numberObjectsWithAssignedDecision;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setDeviationOfNumberObjectsWithAssignedDecision(Double deviationOfNumberObjectsWithAssignedDecision) {
            this.deviationOfNumberObjectsWithAssignedDecision = deviationOfNumberObjectsWithAssignedDecision;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setNumberOfUnknownOriginalDecisions(Double numberOfUnknownOriginalDecisions) {
            this.numberOfUnknownOriginalDecisions = numberOfUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setDeviationOfNumberOfUnknownOriginalDecisions(Double deviationOfNumberOfUnknownOriginalDecisions) {
            this.deviationOfNumberOfUnknownOriginalDecisions = deviationOfNumberOfUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setNumberOfUnknownAssignments(Double numberOfUnknownAssignments) {
            this.numberOfUnknownAssignments = numberOfUnknownAssignments;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setDeviationOfNumberOfUnknownAssignments(Double deviationOfNumberOfUnknownAssignments) {
            this.deviationOfNumberOfUnknownAssignments = deviationOfNumberOfUnknownAssignments;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions(Double numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions) {
            this.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisClassificationMatrixTraitsBuilder setDeviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions(Double deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions) {
            this.deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisclassificationMatrixTraits build() {
            OrdinalMisclassificationMatrixTraits ommt = new OrdinalMisclassificationMatrixTraits();

            ommt.accuracy = this.accuracy;
            ommt.deviationOfAccuracy = this.deviationOfAccuracy;
            ommt.MAE = this.MAE;
            ommt.RMSE = this.RMSE;
            ommt.Gmean = this.Gmean;
            ommt.numberOfCorrectAssignments = this.numberOfCorrectAssignments;
            ommt.deviationOfNumberOfCorrectAssignments = this.deviationOfNumberOfCorrectAssignments;
            ommt.numberOfIncorrectAssignments = this.numberOfIncorrectAssignments;
            ommt.deviationOfNumberOfIncorrectAssignments = this.deviationOfNumberOfIncorrectAssignments;
            ommt.numberObjectsWithAssignedDecision = this.numberObjectsWithAssignedDecision;
            ommt.deviationOfNumberObjectsWithAssignedDecision = this.deviationOfNumberObjectsWithAssignedDecision;
            ommt.numberOfUnknownOriginalDecisions = this.numberOfUnknownOriginalDecisions;
            ommt.deviationOfNumberOfUnknownOriginalDecisions = this.deviationOfNumberOfUnknownOriginalDecisions;
            ommt.numberOfUnknownAssignments = this.numberOfUnknownAssignments;
            ommt.deviationOfNumberOfUnknownAssignments = this.deviationOfNumberOfUnknownAssignments;
            ommt.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = this.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
            ommt.deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = this.deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;

            return ommt;
        }

        public OrdinalMisclassificationMatrixTraits build(OrdinalMisclassificationMatrix matrix) {
            OrdinalMisclassificationMatrixTraits ommt = new OrdinalMisclassificationMatrixTraits();

            ommt.accuracy = matrix.getAccuracy();
            ommt.deviationOfAccuracy = matrix.getDeviationOfAccuracy();
            ommt.MAE = matrix.getMAE();
            ommt.RMSE = matrix.getRMSE();
            ommt.Gmean = matrix.getGmean();
            ommt.numberOfCorrectAssignments = matrix.getNumberOfCorrectAssignments();
            ommt.deviationOfNumberOfCorrectAssignments = matrix.getDeviationOfNumberOfCorrectAssignments();
            ommt.numberOfIncorrectAssignments = matrix.getNumberOfIncorrectAssignments();
            ommt.deviationOfNumberOfIncorrectAssignments = matrix.getDeviationOfNumberOfIncorrectAssignments();
            ommt.numberObjectsWithAssignedDecision = matrix.getNumberObjectsWithAssignedDecision();
            ommt.deviationOfNumberObjectsWithAssignedDecision = matrix.getDeviationOfNumberObjectsWithAssignedDecision();
            ommt.numberOfUnknownOriginalDecisions = matrix.getNumberOfUnknownOriginalDecisions();
            ommt.deviationOfNumberOfUnknownOriginalDecisions = matrix.getDeviationOfNumberOfUnknownOriginalDecisions();
            ommt.numberOfUnknownAssignments = matrix.getNumberOfUnknownAssignments();
            ommt.deviationOfNumberOfUnknownAssignments = matrix.getDeviationOfNumberOfUnknownAssignments();
            ommt.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = matrix.getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions();
            ommt.deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = matrix.getDeviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions();

            return ommt;
        }
    }
}
