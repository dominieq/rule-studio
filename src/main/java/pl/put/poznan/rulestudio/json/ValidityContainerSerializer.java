package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulestudio.model.ValidityProjectContainer;

import java.io.IOException;

@JsonComponent
public class ValidityContainerSerializer extends JsonSerializer<ValidityProjectContainer> {

    private static final Logger logger = LoggerFactory.getLogger(ValidityContainerSerializer.class);

    @Override
    public void serialize(ValidityProjectContainer validityProjectContainer, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {

        logger.debug("Serialization of ValidityProjectContainer:\t{}", validityProjectContainer);

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("dominanceCones");
        if(validityProjectContainer.getDominanceCones() != null) {
            jsonGenerator.writeStartObject();
                jsonGenerator.writeBooleanField("isCurrentData", validityProjectContainer.getDominanceCones());
            jsonGenerator.writeEndObject();
        } else {
            jsonGenerator.writeNull();
        }

        jsonGenerator.writeFieldName("unions");
        if(validityProjectContainer.getUnions() != null) {
            jsonGenerator.writeStartObject();
                jsonGenerator.writeBooleanField("isCurrentData", validityProjectContainer.getUnions());
            jsonGenerator.writeEndObject();
        } else {
            jsonGenerator.writeNull();
        }

        jsonGenerator.writeFieldName("rules");
        if(validityProjectContainer.getRulesExternal() != null) {
            jsonGenerator.writeStartObject();
                jsonGenerator.writeBooleanField("externalRules", validityProjectContainer.getRulesExternal());
                jsonGenerator.writeObjectField("isCurrentData", validityProjectContainer.getRulesData());
            jsonGenerator.writeEndObject();
        } else {
            jsonGenerator.writeNull();
        }

        jsonGenerator.writeFieldName("classification");
        if(validityProjectContainer.getClassificationExternal() != null) {
            jsonGenerator.writeStartObject();
                jsonGenerator.writeBooleanField("externalData", validityProjectContainer.getClassificationExternal());
                jsonGenerator.writeBooleanField("isCurrentProjectData", validityProjectContainer.getClassificationProjectData());
                jsonGenerator.writeObjectField("isCurrentRuleSet", validityProjectContainer.getClassificationRules());
                jsonGenerator.writeObjectField("isCurrentLearningData", validityProjectContainer.getClassificationLearningData());
            jsonGenerator.writeEndObject();
        } else {
            jsonGenerator.writeNull();
        }

        jsonGenerator.writeFieldName("crossValidation");
        if(validityProjectContainer.getCrossValidation() != null) {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeBooleanField("isCurrentData", validityProjectContainer.getCrossValidation());
            jsonGenerator.writeEndObject();
        } else {
            jsonGenerator.writeNull();
        }

        jsonGenerator.writeEndObject();
    }
}
