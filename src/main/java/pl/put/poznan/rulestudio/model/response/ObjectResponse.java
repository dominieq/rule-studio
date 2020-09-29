package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonValue;
import org.rulelearn.data.InformationTable;
import org.rulelearn.types.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

import java.util.LinkedHashMap;

public class ObjectResponse extends ObjectAbstractResponse {

    @JsonValue
    private LinkedHashMap<String, String> value;

    private ObjectResponse() {
        //private constructor
    }

    public LinkedHashMap<String, String> getValue() {
        return value;
    }

    @Override
    public String toString() {
        return "ObjectResponse{" +
                "value=" + value +
                '}';
    }

    public static class ObjectResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ObjectResponseBuilder.class);

        private LinkedHashMap<String, String> value;

        public static ObjectResponseBuilder newInstance() {
            return new ObjectResponseBuilder();
        }

        public ObjectResponseBuilder setValue(LinkedHashMap<String, String> value) {
            this.value = value;
            return this;
        }

        public ObjectResponse build() {
            ObjectResponse objectResponse = new ObjectResponse();

            objectResponse.value = this.value;

            return objectResponse;
        }

        public ObjectResponse build(InformationTable informationTable, Integer objectIndex) {
            if((objectIndex < 0) || (objectIndex >= informationTable.getNumberOfObjects())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given object's index \"%d\" is incorrect. You can choose object from %d to %d", objectIndex, 0, informationTable.getNumberOfObjects() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            ObjectResponse objectResponse = new ObjectResponse();

            Field[] fields = informationTable.getFields(objectIndex);
            objectResponse.value = new LinkedHashMap<>();
            for(int i = 0; i < informationTable.getNumberOfAttributes(); i++) {
                objectResponse.value.put(informationTable.getAttribute(i).getName(), fields[i].toString());
            }

            return objectResponse;
        }
    }
}
