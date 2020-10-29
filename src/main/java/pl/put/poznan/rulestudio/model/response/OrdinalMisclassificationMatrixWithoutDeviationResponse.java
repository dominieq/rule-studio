package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.data.Decision;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.response.OrdinalMisclassificationMatrixTraitsWithoutDeviation.OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder;

import java.util.Arrays;

public class OrdinalMisclassificationMatrixWithoutDeviationResponse extends OrdinalMisclassificationMatrixAbstractResponse{

    @JsonProperty("traits")
    private OrdinalMisclassificationMatrixTraitsWithoutDeviation ordinalMisclassificationMatrixTraitsWithoutDeviation;

    private String[] decisionsDomain;

    @JsonProperty("value")
    private Double[][] value;

    private OrdinalMisclassificationMatrixWithoutDeviationResponse() {
        //private constructor
    }

    public OrdinalMisclassificationMatrixTraitsWithoutDeviation getOrdinalMisclassificationMatrixTraitsWithoutDeviation() {
        return ordinalMisclassificationMatrixTraitsWithoutDeviation;
    }

    public String[] getDecisionsDomain() {
        return decisionsDomain;
    }

    public Double[][] getValue() {
        return value;
    }

    @Override
    public String toString() {
        return "OrdinalMisclassificationMatrixWithoutDeviationResponse{" +
                "ordinalMisclassificationMatrixTraitsWithoutDeviation=" + ordinalMisclassificationMatrixTraitsWithoutDeviation +
                ", decisionsDomain=" + Arrays.toString(decisionsDomain) +
                ", value=" + Arrays.toString(value) +
                "} " + super.toString();
    }

    public static class OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(OrdinalMisclassificationMatrixResponse.OrdinalMisclassificationMatrixResponseBuilder.class);

        private OrdinalMisclassificationMatrixTraitsWithoutDeviation ordinalMisclassificationMatrixTraitsWithoutDeviation;
        private String[] decisionDomain;
        private Double[][] value;

        public static OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder newInstance() {
            return new OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder();
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setOrdinalMisclassificationMatrixTraitsWithoutDeviation(OrdinalMisclassificationMatrixTraitsWithoutDeviation ordinalMisclassificationMatrixTraitsWithoutDeviation) {
            this.ordinalMisclassificationMatrixTraitsWithoutDeviation = ordinalMisclassificationMatrixTraitsWithoutDeviation;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setDecisionDomain(String[] decisionDomain) {
            this.decisionDomain = decisionDomain;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder setValue(Double[][] value) {
            this.value = value;
            return this;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponse build() {
            OrdinalMisclassificationMatrixWithoutDeviationResponse ommwdr = new OrdinalMisclassificationMatrixWithoutDeviationResponse();

            ommwdr.ordinalMisclassificationMatrixTraitsWithoutDeviation = this.ordinalMisclassificationMatrixTraitsWithoutDeviation;
            ommwdr.decisionsDomain = this.decisionDomain;
            ommwdr.value = this.value;

            return ommwdr;
        }

        public OrdinalMisclassificationMatrixWithoutDeviationResponse build(OrdinalMisclassificationMatrix matrix, Decision[] orderOfDecisions) {
            OrdinalMisclassificationMatrixWithoutDeviationResponse ommwdr = new OrdinalMisclassificationMatrixWithoutDeviationResponse();

            ommwdr.ordinalMisclassificationMatrixTraitsWithoutDeviation = OrdinalMisclassificationMatrixTraitsWithoutDeviationBuilder.newInstance().build(matrix);

            final int numberOfDecision = orderOfDecisions.length;
            int i, attributeIndex, row, col;
            Decision decision, originalDecision, assignedDecision;

            ommwdr.decisionsDomain = new String[numberOfDecision];
            for(i = 0; i < numberOfDecision; i++) {
                decision = orderOfDecisions[i];
                attributeIndex = decision.getAttributeIndices().iterator().nextInt(); //assumption that there is only one decision attribute
                ommwdr.decisionsDomain[i] = decision.getEvaluation(attributeIndex).toString();
            }

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
