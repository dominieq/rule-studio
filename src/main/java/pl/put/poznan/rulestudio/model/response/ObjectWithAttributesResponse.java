package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonRawValue;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.json.InformationTableWriter;
import org.rulelearn.types.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

import java.io.IOException;
import java.io.StringWriter;
import java.util.LinkedHashMap;

public class ObjectWithAttributesResponse extends ObjectResponse {
    private static final Logger logger = LoggerFactory.getLogger(ObjectWithAttributesResponse.class);

    @JsonRawValue
    private String attributes;

    public ObjectWithAttributesResponse(InformationTable informationTable, Integer objectIndex) throws IOException {
        super(informationTable, objectIndex);

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
        return "ObjectWithAttributesResponse{" +
                "attributes='" + attributes + '\'' +
                "} " + super.toString();
    }
}
