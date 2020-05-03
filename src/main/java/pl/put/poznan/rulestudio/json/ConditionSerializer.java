package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import org.rulelearn.rules.Condition;

import java.io.IOException;

@JsonComponent
public class ConditionSerializer extends JsonSerializer<Condition> {

    private static final Logger logger = LoggerFactory.getLogger(ConditionSerializer.class);

    @Override
    public void serialize(Condition condition, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        logger.debug("Serialization of Condition:\t{}", condition);

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("toString");
        jsonGenerator.writeString(condition.toString());

        jsonGenerator.writeFieldName("attributeName");
        jsonGenerator.writeString(condition.getAttributeWithContext().getAttributeName());

        jsonGenerator.writeFieldName("relationSymbol");
        jsonGenerator.writeString(condition.getRelationSymbol());

        jsonGenerator.writeFieldName("limitingEvaluation");
        jsonGenerator.writeString(condition.getLimitingEvaluation().toString());

        jsonGenerator.writeEndObject();
    }
}
