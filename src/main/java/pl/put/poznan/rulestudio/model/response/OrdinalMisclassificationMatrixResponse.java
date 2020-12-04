package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.data.Decision;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.response.OrdinalMisclassificationMatrixTraits.OrdinalMisClassificationMatrixTraitsBuilder;

import java.util.Arrays;

public class OrdinalMisclassificationMatrixResponse extends OrdinalMisclassificationMatrixAbstractResponse{

    @JsonProperty("traits")
    private OrdinalMisclassificationMatrixTraits ordinalMisclassificationMatrixTraits;

    private String[] decisionsDomain;

    @JsonProperty("value")
    private Double[][] value;

    @JsonProperty("Deviation of value")
    private Double[][] deviationOfValue;

    private OrdinalMisclassificationMatrixResponse() {
        //private constructor
    }

    public OrdinalMisclassificationMatrixTraits getOrdinalMisclassificationMatrixTraits() {
        return ordinalMisclassificationMatrixTraits;
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
                "ordinalMisclassificationMatrixTraits=" + ordinalMisclassificationMatrixTraits +
                ", decisionsDomain=" + Arrays.toString(decisionsDomain) +
                ", value=" + Arrays.toString(value) +
                ", deviationOfValue=" + Arrays.toString(deviationOfValue) +
                "} " + super.toString();
    }

    public static class OrdinalMisclassificationMatrixResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(OrdinalMisclassificationMatrixResponseBuilder.class);

        private OrdinalMisclassificationMatrixTraits ordinalMisclassificationMatrixTraits;
        private String[] decisionDomain;
        private Double[][] value;
        private Double[][] deviationOfValue;

        public static OrdinalMisclassificationMatrixResponseBuilder newInstance() {
            return new OrdinalMisclassificationMatrixResponseBuilder();
        }

        public OrdinalMisclassificationMatrixResponseBuilder setOrdinalMisclassificationMatrixTraits(OrdinalMisclassificationMatrixTraits ordinalMisclassificationMatrixTraits) {
            this.ordinalMisclassificationMatrixTraits = ordinalMisclassificationMatrixTraits;
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

            ommr.ordinalMisclassificationMatrixTraits = this.ordinalMisclassificationMatrixTraits;
            ommr.decisionsDomain = this.decisionDomain;
            ommr.value = this.value;
            ommr.deviationOfValue = this.deviationOfValue;

            return ommr;
        }

        public OrdinalMisclassificationMatrixResponse build(OrdinalMisclassificationMatrix matrix, Decision[] orderOfDecisions) {
            OrdinalMisclassificationMatrixResponse ommr = new OrdinalMisclassificationMatrixResponse();

            ommr.ordinalMisclassificationMatrixTraits = OrdinalMisClassificationMatrixTraitsBuilder.newInstance().build(matrix);

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
