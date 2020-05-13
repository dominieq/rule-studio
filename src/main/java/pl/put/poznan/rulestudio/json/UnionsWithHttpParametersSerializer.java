package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulestudio.model.UnionsWithHttpParameters;

import java.io.IOException;

@JsonComponent
public class UnionsWithHttpParametersSerializer extends JsonSerializer<UnionsWithHttpParameters> {

    private static final Logger logger = LoggerFactory.getLogger(UnionsWithHttpParametersSerializer.class);

    @Override
    public void serialize(UnionsWithHttpParameters unionsWithHttpParameters, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        logger.debug("Serialization of UnionsWithHttpParameters:\t{}", unionsWithHttpParameters);

        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        jsonGenerator.writeStartObject();

        UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = unionsWithHttpParameters.getUnions();

        jsonGenerator.writeFieldName("qualityOfApproximation");
        jsonGenerator.writeNumber(unionsWithSingleLimitingDecision.getQualityOfApproximation());

        jsonGenerator.writeFieldName("downwardUnions");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionsWithSingleLimitingDecision.getDownwardUnions()));

        jsonGenerator.writeFieldName("upwardUnions");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(unionsWithSingleLimitingDecision.getUpwardUnions()));


        jsonGenerator.writeFieldName("typeOfUnions");
        jsonGenerator.writeString(unionsWithHttpParameters.getTypeOfUnions().toString());

        jsonGenerator.writeFieldName("consistencyThreshold");
        jsonGenerator.writeNumber(unionsWithHttpParameters.getConsistencyThreshold());

        jsonGenerator.writeFieldName("dataHash");
        jsonGenerator.writeString(unionsWithHttpParameters.getDataHash());

        jsonGenerator.writeEndObject();
    }
}
