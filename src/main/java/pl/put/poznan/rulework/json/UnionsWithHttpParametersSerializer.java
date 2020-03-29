package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulework.model.UnionsWithHttpParameters;

import java.io.IOException;

@JsonComponent
public class UnionsWithHttpParametersSerializer extends JsonSerializer<UnionsWithHttpParameters> {

    @Override
    public void serialize(UnionsWithHttpParameters unionsWithHttpParameters, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        jsonGenerator.writeStartObject();

        UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = unionsWithHttpParameters.getUnions();

        jsonGenerator.writeFieldName("qualityOfApproximation");
        jsonGenerator.writeNumber(unionsWithSingleLimitingDecision.getQualityOfApproximation());

        jsonGenerator.writeFieldName("downwardUnions");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionsWithSingleLimitingDecision.getDownwardUnions()));

        jsonGenerator.writeFieldName("upwardUnions");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionsWithSingleLimitingDecision.getUpwardUnions()));


        jsonGenerator.writeFieldName("consistencyThreshold");
        jsonGenerator.writeNumber(unionsWithHttpParameters.getConsistencyThreshold());

        jsonGenerator.writeFieldName("typeOfUnion");
        jsonGenerator.writeString(unionsWithHttpParameters.getTypeOfUnion().toString());

        jsonGenerator.writeEndObject();
    }
}
