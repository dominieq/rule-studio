package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonRawValue;
import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.json.InformationTableWriter;
import org.rulelearn.types.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.Classification;

import java.io.IOException;
import java.io.StringWriter;
import java.util.LinkedHashMap;

public class ChosenClassifiedObjectWithAttributesResponse extends ChosenClassifiedObjectResponse {

    @JsonRawValue
    private String attributes;

    public ChosenClassifiedObjectWithAttributesResponse(Classification classification, Integer classifiedObjectIndex) throws IOException {
        super(classification, classifiedObjectIndex);

        final InformationTable classifiedInformationTable = classification.getInformationTable();
        StringWriter attributesWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(false);
        itw.writeAttributes(classifiedInformationTable, attributesWriter);
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
