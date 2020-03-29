package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulework.model.RulesWithHttpParameters;

import java.io.IOException;

@JsonComponent
public class RulesWithHttpParametersSerializer extends JsonSerializer<RulesWithHttpParameters> {

    private static final Logger logger = LoggerFactory.getLogger(RulesWithHttpParametersSerializer.class);

    @Override
    public void serialize(RulesWithHttpParameters rulesWithHttpParameters, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        logger.debug("Serialization of RulesWithHttpParameters:\t{}", rulesWithHttpParameters);

        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("ruleSet");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(rulesWithHttpParameters.getRuleSet()));

        jsonGenerator.writeFieldName("typeOfUnion");
        jsonGenerator.writeString(rulesWithHttpParameters.getTypeOfUnion().toString());

        jsonGenerator.writeFieldName("consistencyThreshold");
        jsonGenerator.writeNumber(rulesWithHttpParameters.getConsistencyThreshold());

        jsonGenerator.writeFieldName("typeOfRules");
        jsonGenerator.writeString(rulesWithHttpParameters.getTypeOfRule().toString());

        jsonGenerator.writeEndObject();
    }
}
