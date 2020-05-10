package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulestudio.model.Project;

import java.io.IOException;
import java.util.ArrayList;

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
        InformationTable informationTable = project.getInformationTable();
        if(informationTable == null) {
            jsonGenerator.writeRawValue(mapper.writeValueAsString(new InformationTable(new Attribute[0], new ArrayList<>())));
        } else {
            jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getInformationTable()));
        }

        jsonGenerator.writeFieldName("dominanceCones");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getDominanceCones()));

        jsonGenerator.writeFieldName("unions");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getUnions()));

        jsonGenerator.writeFieldName("rules");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getRules()));

        jsonGenerator.writeFieldName("classification");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getClassification()));

        jsonGenerator.writeFieldName("crossValidation");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(project.getCrossValidation()));

        if(project.getMetadataFileName() != null) {
            jsonGenerator.writeFieldName("metadataFileName");
            jsonGenerator.writeString(project.getMetadataFileName());
        }

        if(project.getDataFileName() != null) {
            jsonGenerator.writeFieldName("dataFileName");
            jsonGenerator.writeString(project.getDataFileName());
        }

        jsonGenerator.writeEndObject();
    }
}
