package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.rulelearn.data.InformationTable;
import org.rulelearn.types.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

import java.util.LinkedHashMap;

@JsonFormat(shape = JsonFormat.Shape.ARRAY)
public class ObjectsComparisonResponse {

    private LinkedHashMap<String, String> firstValue;

    private LinkedHashMap<String, String> secondValue;

    private ObjectsComparisonResponse() {
        //private constructor
    }

    public LinkedHashMap<String, String> getFirstValue() {
        return firstValue;
    }

    public LinkedHashMap<String, String> getSecondValue() {
        return secondValue;
    }

    @Override
    public String toString() {
        return "ObjectsComparisonResponse{" +
                "firstValue=" + firstValue +
                ", secondValue=" + secondValue +
                '}';
    }

    public static class ObjectsComparisonResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ObjectsComparisonResponseBuilder.class);

        private LinkedHashMap<String, String> firstValue;
        private LinkedHashMap<String, String> secondValue;

        public static ObjectsComparisonResponseBuilder newInstance() {
            return new ObjectsComparisonResponseBuilder();
        }

        public void setFirstValue(LinkedHashMap<String, String> firstValue) {
            this.firstValue = firstValue;
        }

        public void setSecondValue(LinkedHashMap<String, String> secondValue) {
            this.secondValue = secondValue;
        }

        public ObjectsComparisonResponse build() {
            ObjectsComparisonResponse objectsComparisonResponse = new ObjectsComparisonResponse();

            objectsComparisonResponse.firstValue = this.firstValue;
            objectsComparisonResponse.secondValue = this.secondValue;

            return objectsComparisonResponse;
        }

        private LinkedHashMap<String, String> readObjectValue(InformationTable informationTable, Integer objectIndex) {
            LinkedHashMap<String, String> value = new LinkedHashMap<>();

            final Field[] fields = informationTable.getFields(objectIndex);
            for(int i = 0; i < informationTable.getNumberOfAttributes(); i++) {
                value.put(informationTable.getAttribute(i).getName(), fields[i].toString());
            }

            return value;
        }

        public ObjectsComparisonResponse build(InformationTable informationTable, Integer firstObjectIndex, Integer secondObjectIndex) {
            if((firstObjectIndex < 0) || (firstObjectIndex >= informationTable.getNumberOfObjects())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given first object's index \"%d\" is incorrect. You can choose object from %d to %d", firstObjectIndex, 0, informationTable.getNumberOfObjects() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            if((secondObjectIndex < 0) || (secondObjectIndex >= informationTable.getNumberOfObjects())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given second object's index \"%d\" is incorrect. You can choose object from %d to %d", secondObjectIndex, 0, informationTable.getNumberOfObjects() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            ObjectsComparisonResponse objectsComparisonResponse = new ObjectsComparisonResponse();

            objectsComparisonResponse.firstValue = readObjectValue(informationTable, firstObjectIndex);
            objectsComparisonResponse.secondValue = readObjectValue(informationTable, secondObjectIndex);

            return objectsComparisonResponse;
        }
    }
}
