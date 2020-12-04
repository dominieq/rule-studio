package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonRawValue;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.json.InformationTableWriter;

import java.io.IOException;
import java.io.StringWriter;

public class InformationTableResponse {

    @JsonRawValue
    private String attributes;

    @JsonRawValue
    private String objects;

    public InformationTableResponse(InformationTable informationTable) throws IOException {

        StringWriter attributesWriter = new StringWriter();
        StringWriter objectsWriter = new StringWriter();

        final InformationTableWriter itw = new InformationTableWriter(false);
        itw.writeAttributes(informationTable, attributesWriter);
        itw.writeObjects(informationTable, objectsWriter);

        this.attributes = attributesWriter.toString();
        this.objects = objectsWriter.toString();
    }

    public String getAttributes() {
        return attributes;
    }

    public String getObjects() {
        return objects;
    }

    @Override
    public String toString() {
        return "InformationTableResponse{" +
                "attributes='" + attributes + '\'' +
                ", objects='" + objects + '\'' +
                '}';
    }
}
