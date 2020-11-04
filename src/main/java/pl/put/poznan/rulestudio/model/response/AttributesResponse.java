package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.annotation.JsonValue;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.json.InformationTableWriter;

import java.io.IOException;
import java.io.StringWriter;

public class AttributesResponse {

    @JsonValue
    @JsonRawValue
    private String attributes;

    public AttributesResponse(InformationTable informationTable) throws IOException {
        StringWriter attributesWriter = new StringWriter();

        final InformationTableWriter itw = new InformationTableWriter(false);
        itw.writeAttributes(informationTable, attributesWriter);

        this.attributes = attributesWriter.toString();
    }

    public String getAttributes() {
        return attributes;
    }

    @Override
    public String toString() {
        return "AttributesResponse{" +
                "attributes='" + attributes + '\'' +
                '}';
    }
}
