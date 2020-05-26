package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.approximations.UnionWithSingleLimitingDecision;
import org.rulelearn.types.EvaluationField;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;
import java.util.Arrays;

@JsonComponent
public class UnionWithSingleLimitingDecisionSerializer extends JsonSerializer<UnionWithSingleLimitingDecision> {

    private void serializeLimitingDecision(UnionWithSingleLimitingDecision unionWithSingleLimitingDecision, JsonGenerator jsonGenerator) throws IOException {
        jsonGenerator.writeFieldName("limitingDecision");
        int attributeIndex = unionWithSingleLimitingDecision.getLimitingDecision().getAttributeIndices().iterator().nextInt(); //assumption that there is only one decision attribute
        EvaluationField evaluationField = unionWithSingleLimitingDecision.getLimitingDecision().getEvaluation(attributeIndex);
        jsonGenerator.writeString(evaluationField.toString());
    }

    @Override
    public void serialize(UnionWithSingleLimitingDecision unionWithSingleLimitingDecision, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("Objects");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getObjects()));

        jsonGenerator.writeFieldName("Lower approximation");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getLowerApproximation()));

        jsonGenerator.writeFieldName("Upper approximation");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getUpperApproximation()));

        jsonGenerator.writeFieldName("Boundary");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getBoundary()));

        int[] positiveRegion = unionWithSingleLimitingDecision.getPositiveRegion().toIntArray();
        Arrays.sort(positiveRegion);
        jsonGenerator.writeFieldName("Positive region");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(positiveRegion));

        int[] negativeRegion = unionWithSingleLimitingDecision.getNegativeRegion().toIntArray();
        Arrays.sort(negativeRegion);
        jsonGenerator.writeFieldName("Negative region");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(negativeRegion));

        int[] boundaryRegion = unionWithSingleLimitingDecision.getBoundaryRegion().toIntArray();
        Arrays.sort(boundaryRegion);
        jsonGenerator.writeFieldName("Boundary region");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(boundaryRegion));

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
