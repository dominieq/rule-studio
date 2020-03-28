package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulework.model.Project;

import java.io.IOException;

@JsonComponent
public class ProjectSerializer extends JsonSerializer<Project> {

    private static final Logger logger = LoggerFactory.getLogger(ProjectSerializer.class);

    @Override
    public void serialize(Project project, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        logger.debug("Serialization of Project:\t{}", project);

        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("id");
        jsonGenerator.writeString(project.getId().toString());

        jsonGenerator.writeFieldName("name");
        jsonGenerator.writeString(project.getName());

        jsonGenerator.writeFieldName("informationTable");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getInformationTable()));

        jsonGenerator.writeFieldName("dominanceCones");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getDominanceCones()));

        jsonGenerator.writeFieldName("unionsWithSingleLimitingDecision");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getUnionsWithSingleLimitingDecision()));

        jsonGenerator.writeFieldName("ruleSetWithComputableCharacteristics");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getRuleSetWithComputableCharacteristics()));

        jsonGenerator.writeFieldName("classification");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getClassification()));

        jsonGenerator.writeFieldName("crossValidation");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getCrossValidation()));

        jsonGenerator.writeEndObject();
    }
}
