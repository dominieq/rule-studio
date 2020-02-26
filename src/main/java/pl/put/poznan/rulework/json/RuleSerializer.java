package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.rules.Rule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;

@JsonComponent
public class RuleSerializer extends JsonSerializer<Rule> {

    private static final Logger logger = LoggerFactory.getLogger(RuleSerializer.class);

    @Override
    public void serialize(Rule rule, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        logger.debug("Serialization of Rule:\t{}", rule);

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("toString");
        jsonGenerator.writeString(rule.toString());

        jsonGenerator.writeFieldName("type");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(rule.getType()));

        jsonGenerator.writeFieldName("conditions");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(rule.getConditions()));

        jsonGenerator.writeFieldName("decisions");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(rule.getDecisions()));

        jsonGenerator.writeEndObject();
    }
}
