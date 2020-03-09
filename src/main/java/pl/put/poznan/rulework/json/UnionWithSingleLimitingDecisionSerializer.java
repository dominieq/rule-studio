package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.approximations.UnionWithSingleLimitingDecision;
import org.rulelearn.types.EnumerationField;
import org.rulelearn.types.EvaluationField;
import org.rulelearn.types.IntegerField;
import org.rulelearn.types.RealField;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;

@JsonComponent
public class UnionWithSingleLimitingDecisionSerializer extends JsonSerializer<UnionWithSingleLimitingDecision> {

    private void serializeLimitingDecision(UnionWithSingleLimitingDecision unionWithSingleLimitingDecision, JsonGenerator jsonGenerator) throws IOException {
        jsonGenerator.writeFieldName("limitingDecision");
        int attributeIndex = unionWithSingleLimitingDecision.getLimitingDecision().getAttributeIndices().iterator().nextInt(); //assumption that there is only one decision attribute
        EvaluationField evaluationField = unionWithSingleLimitingDecision.getLimitingDecision().getEvaluation(attributeIndex);
        if(evaluationField instanceof EnumerationField) {
            jsonGenerator.writeRawValue(((EnumerationField)evaluationField).getElement());
        } else if (evaluationField instanceof IntegerField) {
            jsonGenerator.writeNumber(((IntegerField)evaluationField).getValue());
        } else if (evaluationField instanceof RealField) {
            jsonGenerator.writeNumber(((RealField)evaluationField).getValue());
        } else {
            jsonGenerator.writeString("Unrecognized type of EvaluationField");
        }
    }

    @Override
    public void serialize(UnionWithSingleLimitingDecision unionWithSingleLimitingDecision, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("lowerApproximation");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getLowerApproximation()));

        jsonGenerator.writeFieldName("upperApproximation");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getUpperApproximation()));

        jsonGenerator.writeFieldName("boundary");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getBoundary()));

        jsonGenerator.writeFieldName("positiveRegion");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getPositiveRegion()));

        jsonGenerator.writeFieldName("negativeRegion");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getNegativeRegion()));

        jsonGenerator.writeFieldName("boundaryRegion");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getBoundaryRegion()));

        jsonGenerator.writeFieldName("objects");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getObjects()));

        jsonGenerator.writeFieldName("unionType");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getUnionType()));

        serializeLimitingDecision(unionWithSingleLimitingDecision, jsonGenerator);

        jsonGenerator.writeFieldName("accuracyOfApproximation");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getAccuracyOfApproximation()));

        jsonGenerator.writeFieldName("qualityOfApproximation");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getQualityOfApproximation()));

        jsonGenerator.writeEndObject();
    }
}
