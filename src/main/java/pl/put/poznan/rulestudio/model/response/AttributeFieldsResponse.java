package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonValue;
import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;

public class AttributeFieldsResponse {

    @JsonValue
    private String[] fields;

    private AttributeFieldsResponse() {
        //private constructor
    }

    public String[] getFields() {
        return fields;
    }

    @Override
    public String toString() {
        return "AttributeFieldsResponse{" +
                "fields=" + Arrays.toString(fields) +
                '}';
    }

    public static class AttributeFieldsResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(AttributeFieldsResponseBuilder.class);

        private String[] fields;

        public static AttributeFieldsResponseBuilder newInstance() {
            return new AttributeFieldsResponseBuilder();
        }

        public AttributeFieldsResponseBuilder setFields(String[] fields) {
            this.fields = fields;
            return this;
        }

        public AttributeFieldsResponse build() {
            AttributeFieldsResponse attributeFieldsResponse = new AttributeFieldsResponse();

            attributeFieldsResponse.fields = this.fields;

            return attributeFieldsResponse;
        }

        public AttributeFieldsResponse build(InformationTable informationTable, Integer attributeIndex) {
            AttributeFieldsResponse attributeFieldsResponse = new AttributeFieldsResponse();

            attributeFieldsResponse.fields = new String[informationTable.getNumberOfObjects()];
            if(attributeIndex == null) {
                String base = "Object ";
                StringBuilder sb;
                for(int objectIndex = 0; objectIndex < informationTable.getNumberOfObjects(); objectIndex++) {
                    sb = new StringBuilder(base);
                    sb.append(objectIndex + 1);
                    attributeFieldsResponse.fields[objectIndex] = sb.toString();
                }
            } else {
                for(int objectIndex = 0; objectIndex < informationTable.getNumberOfObjects(); objectIndex++) {
                    attributeFieldsResponse.fields[objectIndex] = informationTable.getField(objectIndex, attributeIndex).toString();
                }
            }

            return attributeFieldsResponse;
        }
    }
}
