package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.json.InformationTableWriter;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;
import java.io.StringWriter;

@JsonComponent
public class InformationTableSerializer extends JsonSerializer<InformationTable> {

    @Override
    public void serialize(InformationTable informationTable, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();

        StringWriter attributesWriter = new StringWriter();
        StringWriter objectsWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(false);
        itw.writeAttributes(informationTable, attributesWriter);
        itw.writeObjects(informationTable, objectsWriter);
        jsonGenerator.writeFieldName("attributes");
        jsonGenerator.writeRawValue(attributesWriter.toString());
        jsonGenerator.writeFieldName("objects");
        jsonGenerator.writeRawValue(objectsWriter.toString());

        jsonGenerator.writeEndObject();
    }
}
