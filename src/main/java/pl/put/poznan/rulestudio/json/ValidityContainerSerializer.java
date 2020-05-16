package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulestudio.model.ValidityContainer;

import java.io.IOException;

@JsonComponent
public class ValidityContainerSerializer extends JsonSerializer<ValidityContainer> {

    private static final Logger logger = LoggerFactory.getLogger(ValidityContainerSerializer.class);

    @Override
    public void serialize(ValidityContainer validityContainer, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {

        logger.debug("Serialization of ValidityContainer:\t{}", validityContainer);

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("dominanceCones");
        jsonGenerator.writeStartObject();
            jsonGenerator.writeBooleanField("isCurrentData", validityContainer.getDominanceCones());
        jsonGenerator.writeEndObject();

        jsonGenerator.writeFieldName("unions");
        jsonGenerator.writeStartObject();
            jsonGenerator.writeBooleanField("isCurrentData", validityContainer.getUnions());
        jsonGenerator.writeEndObject();

        jsonGenerator.writeFieldName("rules");
        jsonGenerator.writeStartObject();
            jsonGenerator.writeBooleanField("externalRules", validityContainer.getRulesExternal());
            jsonGenerator.writeBooleanField("isCurrentData", validityContainer.getRulesData());
        jsonGenerator.writeEndObject();

        jsonGenerator.writeFieldName("classification");
        jsonGenerator.writeStartObject();
            jsonGenerator.writeBooleanField("externalData", validityContainer.getClassificationExternal());
            jsonGenerator.writeBooleanField("isCurrentLearningData", validityContainer.getClassificationLearningData());
            jsonGenerator.writeBooleanField("isCurrentRuleSet", validityContainer.getClassificationRules());
        jsonGenerator.writeEndObject();

        jsonGenerator.writeFieldName("crossValidation");
        jsonGenerator.writeStartObject();
            jsonGenerator.writeBooleanField("isCurrentData", validityContainer.getCrossValidation());
        jsonGenerator.writeEndObject();

        jsonGenerator.writeEndObject();
    }
}
