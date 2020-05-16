package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulestudio.model.ValidityRulesContainer;

import java.io.IOException;

@JsonComponent
public class ValidityRulesContainerSerializer extends JsonSerializer<ValidityRulesContainer> {

    private static final Logger logger = LoggerFactory.getLogger(ValidityRulesContainerSerializer.class);

    @Override
    public void serialize(ValidityRulesContainer validityRulesContainer, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {

        logger.debug("Serialization of ValidityRulesContainerSerializer:\t{}", validityRulesContainer);

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("unions");
        if(validityRulesContainer.getUnions() != null) {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeBooleanField("isCurrentData", validityRulesContainer.getUnions());
            jsonGenerator.writeEndObject();
        } else {
            jsonGenerator.writeNull();
        }

        jsonGenerator.writeFieldName("rules");
        if(validityRulesContainer.getRulesExternal() != null) {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeBooleanField("externalRules", validityRulesContainer.getRulesExternal());
            jsonGenerator.writeBooleanField("isCurrentData", validityRulesContainer.getRulesData());
            jsonGenerator.writeEndObject();
        } else {
            jsonGenerator.writeNull();
        }

        jsonGenerator.writeFieldName("classification");
        if(validityRulesContainer.getClassificationExternal() != null) {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeBooleanField("externalData", validityRulesContainer.getClassificationExternal());
            jsonGenerator.writeBooleanField("isCurrentLearningData", validityRulesContainer.getClassificationLearningData());
            jsonGenerator.writeBooleanField("isCurrentRuleSet", validityRulesContainer.getClassificationRules());
            jsonGenerator.writeEndObject();
        } else {
            jsonGenerator.writeNull();
        }

        jsonGenerator.writeEndObject();
    }
}
