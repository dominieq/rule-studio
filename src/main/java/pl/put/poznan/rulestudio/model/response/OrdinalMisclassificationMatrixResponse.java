package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.data.Decision;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;

public class OrdinalMisclassificationMatrixResponse extends OrdinalMisclassificationMatrixAbstractResponse{

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

    private String[] decisionsDomain;

    @JsonProperty("value")
    private Double[][] value;

    @JsonProperty("Deviation of value")
    private Double[][] deviationOfValue;

    private OrdinalMisclassificationMatrixResponse() {
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

    public String[] getDecisionsDomain() {
        return decisionsDomain;
    }

    public Double[][] getValue() {
        return value;
    }

    public Double[][] getDeviationOfValue() {
        return deviationOfValue;
    }

    @Override
    public String toString() {
        return "OrdinalMisclassificationMatrixResponse{" +
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
                ", decisionsDomain=" + Arrays.toString(decisionsDomain) +
                ", value=" + Arrays.toString(value) +
                ", deviationOfValue=" + Arrays.toString(deviationOfValue) +
                "} " + super.toString();
    }

    public static class OrdinalMisclassificationMatrixResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(OrdinalMisclassificationMatrixResponseBuilder.class);

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
        private String[] decisionDomain;
        private Double[][] value;
        private Double[][] deviationOfValue;

        public static OrdinalMisclassificationMatrixResponseBuilder newInstance() {
            return new OrdinalMisclassificationMatrixResponseBuilder();
        }

        public OrdinalMisclassificationMatrixResponseBuilder setAccuracy(Double accuracy) {
            this.accuracy = accuracy;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setDeviationOfAccuracy(Double deviationOfAccuracy) {
            this.deviationOfAccuracy = deviationOfAccuracy;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setMAE(Double MAE) {
            this.MAE = MAE;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setRMSE(Double RMSE) {
            this.RMSE = RMSE;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setGmean(Double gmean) {
            Gmean = gmean;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setNumberOfCorrectAssignments(Double numberOfCorrectAssignments) {
            this.numberOfCorrectAssignments = numberOfCorrectAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setDeviationOfNumberOfCorrectAssignments(Double deviationOfNumberOfCorrectAssignments) {
            this.deviationOfNumberOfCorrectAssignments = deviationOfNumberOfCorrectAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setNumberOfIncorrectAssignments(Double numberOfIncorrectAssignments) {
            this.numberOfIncorrectAssignments = numberOfIncorrectAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setDeviationOfNumberOfIncorrectAssignments(Double deviationOfNumberOfIncorrectAssignments) {
            this.deviationOfNumberOfIncorrectAssignments = deviationOfNumberOfIncorrectAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setNumberObjectsWithAssignedDecision(Double numberObjectsWithAssignedDecision) {
            this.numberObjectsWithAssignedDecision = numberObjectsWithAssignedDecision;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setDeviationOfNumberObjectsWithAssignedDecision(Double deviationOfNumberObjectsWithAssignedDecision) {
            this.deviationOfNumberObjectsWithAssignedDecision = deviationOfNumberObjectsWithAssignedDecision;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setNumberOfUnknownOriginalDecisions(Double numberOfUnknownOriginalDecisions) {
            this.numberOfUnknownOriginalDecisions = numberOfUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setDeviationOfNumberOfUnknownOriginalDecisions(Double deviationOfNumberOfUnknownOriginalDecisions) {
            this.deviationOfNumberOfUnknownOriginalDecisions = deviationOfNumberOfUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setNumberOfUnknownAssignments(Double numberOfUnknownAssignments) {
            this.numberOfUnknownAssignments = numberOfUnknownAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setDeviationOfNumberOfUnknownAssignments(Double deviationOfNumberOfUnknownAssignments) {
            this.deviationOfNumberOfUnknownAssignments = deviationOfNumberOfUnknownAssignments;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions(Double numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions) {
            this.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setDeviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions(Double deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions) {
            this.deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setDecisionDomain(String[] decisionDomain) {
            this.decisionDomain = decisionDomain;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setValue(Double[][] value) {
            this.value = value;
            return this;
        }

        public OrdinalMisclassificationMatrixResponseBuilder setDeviationOfValue(Double[][] deviationOfValue) {
            this.deviationOfValue = deviationOfValue;
            return this;
        }

        public OrdinalMisclassificationMatrixResponse build() {
            OrdinalMisclassificationMatrixResponse ommr = new OrdinalMisclassificationMatrixResponse();

            ommr.accuracy = this.accuracy;
            ommr.deviationOfAccuracy = this.deviationOfAccuracy;
            ommr.MAE = this.MAE;
            ommr.RMSE = this.RMSE;
            ommr.Gmean = this.Gmean;
            ommr.numberOfCorrectAssignments = this.numberOfCorrectAssignments;
            ommr.deviationOfNumberOfCorrectAssignments = this.deviationOfNumberOfCorrectAssignments;
            ommr.numberOfIncorrectAssignments = this.numberOfIncorrectAssignments;
            ommr.deviationOfNumberOfIncorrectAssignments = this.deviationOfNumberOfIncorrectAssignments;
            ommr.numberObjectsWithAssignedDecision = this.numberObjectsWithAssignedDecision;
            ommr.deviationOfNumberObjectsWithAssignedDecision = this.deviationOfNumberObjectsWithAssignedDecision;
            ommr.numberOfUnknownOriginalDecisions = this.numberOfUnknownOriginalDecisions;
            ommr.deviationOfNumberOfUnknownOriginalDecisions = this.deviationOfNumberOfUnknownOriginalDecisions;
            ommr.numberOfUnknownAssignments = this.numberOfUnknownAssignments;
            ommr.deviationOfNumberOfUnknownAssignments = this.deviationOfNumberOfUnknownAssignments;
            ommr.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = this.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
            ommr.deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = this.deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions;
            ommr.decisionsDomain = this.decisionDomain;
            ommr.value = this.value;
            ommr.deviationOfValue = this.deviationOfValue;

            return ommr;
        }

        public OrdinalMisclassificationMatrixResponse build(OrdinalMisclassificationMatrix matrix, Decision[] orderOfDecisions) {
            OrdinalMisclassificationMatrixResponse ommr = new OrdinalMisclassificationMatrixResponse();

            ommr.accuracy = matrix.getAccuracy();
            ommr.deviationOfAccuracy = matrix.getDeviationOfAccuracy();
            ommr.MAE = matrix.getMAE();
            ommr.RMSE = matrix.getRMSE();
            ommr.Gmean = matrix.getGmean();
            ommr.numberOfCorrectAssignments = matrix.getNumberOfCorrectAssignments();
            ommr.deviationOfNumberOfCorrectAssignments = matrix.getDeviationOfNumberOfCorrectAssignments();
            ommr.numberOfIncorrectAssignments = matrix.getNumberOfIncorrectAssignments();
            ommr.deviationOfNumberOfIncorrectAssignments = matrix.getDeviationOfNumberOfIncorrectAssignments();
            ommr.numberObjectsWithAssignedDecision = matrix.getNumberObjectsWithAssignedDecision();
            ommr.deviationOfNumberObjectsWithAssignedDecision = matrix.getDeviationOfNumberObjectsWithAssignedDecision();
            ommr.numberOfUnknownOriginalDecisions = matrix.getNumberOfUnknownOriginalDecisions();
            ommr.deviationOfNumberOfUnknownOriginalDecisions = matrix.getDeviationOfNumberOfUnknownOriginalDecisions();
            ommr.numberOfUnknownAssignments = matrix.getNumberOfUnknownAssignments();
            ommr.deviationOfNumberOfUnknownAssignments = matrix.getDeviationOfNumberOfUnknownAssignments();
            ommr.numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = matrix.getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions();
            ommr.deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions = matrix.getDeviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions();

            final int numberOfDecision = orderOfDecisions.length;
            int i, attributeIndex, row, col;
            Decision decision, originalDecision, assignedDecision;

            ommr.decisionsDomain = new String[numberOfDecision];
            for(i = 0; i < numberOfDecision; i++) {
                decision = orderOfDecisions[i];
                attributeIndex = decision.getAttributeIndices().iterator().nextInt(); //assumption that there is only one decision attribute
                ommr.decisionsDomain[i] = decision.getEvaluation(attributeIndex).toString();
            }

            ommr.value = new Double[numberOfDecision][];
            for(row = 0; row < numberOfDecision; row++) {
                originalDecision = orderOfDecisions[row];
                ommr.value[row] = new Double[numberOfDecision];

                for(col = 0; col < numberOfDecision; col++) {
                    assignedDecision = orderOfDecisions[col];
                    ommr.value[row][col] = matrix.getValue(originalDecision, assignedDecision);
                }
            }

            ommr.deviationOfValue = new Double[numberOfDecision][];
            for(row = 0; row < numberOfDecision; row++) {
                originalDecision = orderOfDecisions[row];
                ommr.deviationOfValue[row] = new Double[numberOfDecision];

                for(col = 0; col < numberOfDecision; col++) {
                    assignedDecision = orderOfDecisions[col];
                    ommr.deviationOfValue[row][col] = matrix.getDeviationOfValue(originalDecision, assignedDecision);
                }
            }

            return ommr;
        }
    }
}
