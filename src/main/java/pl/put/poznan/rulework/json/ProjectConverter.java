package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.data.json.InformationTableWriter;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulework.model.Project;

import java.io.IOException;
import java.io.StringWriter;

@JsonComponent
public class ProjectConverter {
    public static class Serialize extends JsonSerializer<Project> {

        @Override
        public void serialize(Project project, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeStringField("id", project.getId().toString());
            jsonGenerator.writeStringField("name", project.getName());

            StringWriter attributesWriter = new StringWriter();
            StringWriter objectsWriter = new StringWriter();
            InformationTableWriter itw = new InformationTableWriter(false);
            itw.writeAttributes(project.getInformationTable(), attributesWriter);
            itw.writeObjects(project.getInformationTable(), objectsWriter);
            jsonGenerator.writeFieldName("attributes");
            jsonGenerator.writeRawValue(attributesWriter.toString());
            jsonGenerator.writeFieldName("objects");
            jsonGenerator.writeRawValue(objectsWriter.toString());

            jsonGenerator.writeEndObject();
        }
    }
}
