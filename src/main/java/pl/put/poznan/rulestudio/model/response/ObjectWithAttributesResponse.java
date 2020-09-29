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

public class ObjectWithAttributesResponse extends ObjectAbstractResponse {

    private LinkedHashMap<String, String> value;

    @JsonRawValue
    private String attributes;

    private ObjectWithAttributesResponse() {
        //private constructor
    }

    public LinkedHashMap<String, String> getValue() {
        return value;
    }

    public String getAttributes() {
        return attributes;
    }

    @Override
    public String toString() {
        return "ObjectWithAttributesResponse{" +
                "value=" + value +
                ", attributes='" + attributes + '\'' +
                '}';
    }

    public static class ObjectWithAttributesResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ObjectWithAttributesResponseBuilder.class);

        private LinkedHashMap<String, String> value;
        private String attributes;

        public static ObjectWithAttributesResponseBuilder newInstance() {
            return new ObjectWithAttributesResponseBuilder();
        }

        public ObjectWithAttributesResponseBuilder setValue(LinkedHashMap<String, String> value) {
            this.value = value;
            return this;
        }

        public ObjectWithAttributesResponseBuilder setAttributes(String attributes) {
            this.attributes = attributes;
            return this;
        }

        public ObjectWithAttributesResponse build() {
            ObjectWithAttributesResponse objectWithAttributesResponse = new ObjectWithAttributesResponse();

            objectWithAttributesResponse.value = this.value;
            objectWithAttributesResponse.attributes = this.attributes;

            return objectWithAttributesResponse;
        }

        public ObjectWithAttributesResponse build(InformationTable informationTable, Integer objectIndex) throws IOException {
            if((objectIndex < 0) || (objectIndex >= informationTable.getNumberOfObjects())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given object's index \"%d\" is incorrect. You can choose object from %d to %d", objectIndex, 0, informationTable.getNumberOfObjects() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            ObjectWithAttributesResponse objectWithAttributesResponse = new ObjectWithAttributesResponse();

            Field[] fields = informationTable.getFields(objectIndex);
            objectWithAttributesResponse.value = new LinkedHashMap<>();
            for(int i = 0; i < informationTable.getNumberOfAttributes(); i++) {
                objectWithAttributesResponse.value.put(informationTable.getAttribute(i).getName(), fields[i].toString());
            }

            StringWriter attributesWriter = new StringWriter();
            InformationTableWriter itw = new InformationTableWriter(false);
            itw.writeAttributes(informationTable, attributesWriter);
            objectWithAttributesResponse.attributes = attributesWriter.toString();

            return objectWithAttributesResponse;
        }
    }
}
