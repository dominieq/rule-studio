package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.approximations.UnionWithSingleLimitingDecision;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;

@JsonComponent
public class UnionWithSingleLimitingDecisionSerializer extends JsonSerializer<UnionWithSingleLimitingDecision> {

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

        jsonGenerator.writeFieldName("neutralObjects");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getNeutralObjects()));

        jsonGenerator.writeFieldName("unionType");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getUnionType()));

        jsonGenerator.writeFieldName("limitingDecision");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getLimitingDecision()));

        jsonGenerator.writeFieldName("accuracyOfApproximation");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getAccuracyOfApproximation()));

        jsonGenerator.writeFieldName("qualityOfApproximation");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionWithSingleLimitingDecision.getQualityOfApproximation()));

        jsonGenerator.writeEndObject();
    }
}
