package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonValue;
import org.rulelearn.data.InformationTable;
import org.rulelearn.types.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

import java.util.LinkedHashMap;

public class ObjectResponse extends ObjectAbstractResponse {
    private static final Logger logger = LoggerFactory.getLogger(ObjectResponse.class);

    private LinkedHashMap<String, String> value;

    public ObjectResponse(InformationTable informationTable, Integer objectIndex) {
        if((objectIndex < 0) || (objectIndex >= informationTable.getNumberOfObjects())) {
            WrongParameterException ex = new WrongParameterException(String.format("Given object's index \"%d\" is incorrect. You can choose object from %d to %d", objectIndex, 0, informationTable.getNumberOfObjects() - 1));
            logger.error(ex.getMessage());
            throw ex;
        }

        Field[] fields = informationTable.getFields(objectIndex);
        this.value = new LinkedHashMap<>();
        for(int i = 0; i < informationTable.getNumberOfAttributes(); i++) {
            this.value.put(informationTable.getAttribute(i).getName(), fields[i].toString());
        }
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
}
