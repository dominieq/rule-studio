package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonRawValue;
import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.json.InformationTableWriter;

import java.io.IOException;
import java.io.StringWriter;

public class ChosenClassifiedObjectWithAttributesResponse extends ChosenClassifiedObjectResponse {

    @JsonRawValue
    private String attributes;

    public ChosenClassifiedObjectWithAttributesResponse(InformationTable informationTable, Integer classifiedObjectIndex, IntList indicesOfCoveringRules) throws IOException {
        super(informationTable, classifiedObjectIndex, indicesOfCoveringRules);

        StringWriter attributesWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(false);
        itw.writeAttributes(informationTable, attributesWriter);
        this.attributes = attributesWriter.toString();
    }

    public String getAttributes() {
        return attributes;
    }

    @Override
    public String toString() {
        return "ChosenClassifiedObjectWithAttributesResponse{" +
                "attributes='" + attributes + '\'' +
                "} " + super.toString();
    }
}
