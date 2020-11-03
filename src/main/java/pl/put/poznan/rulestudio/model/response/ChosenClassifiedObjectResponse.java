package pl.put.poznan.rulestudio.model.response;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.data.InformationTable;
import org.rulelearn.types.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

import java.util.LinkedHashMap;

public class ChosenClassifiedObjectResponse extends ChosenClassifiedObjectAbstractResponse {
    private static final Logger logger = LoggerFactory.getLogger(ChosenClassifiedObjectResponse.class);

    private LinkedHashMap<String, String> object;

    private IntList indicesOfCoveringRules;

    public ChosenClassifiedObjectResponse(InformationTable informationTable, Integer classifiedObjectIndex, IntList indicesOfCoveringRules) {
        if((classifiedObjectIndex < 0) || (classifiedObjectIndex >= informationTable.getNumberOfObjects())) {
            WrongParameterException ex = new WrongParameterException(String.format("Given object's index \"%d\" is incorrect. You can choose object from %d to %d", classifiedObjectIndex, 0, informationTable.getNumberOfObjects() - 1));
            logger.error(ex.getMessage());
            throw ex;
        }

        Field[] fields = informationTable.getFields(classifiedObjectIndex);
        this.object = new LinkedHashMap<>();
        for(int i = 0; i < informationTable.getNumberOfAttributes(); i++) {
            this.object.put(informationTable.getAttribute(i).getName(), fields[i].toString());
        }

        this.indicesOfCoveringRules = indicesOfCoveringRules;
    }

    public LinkedHashMap<String, String> getObject() {
        return object;
    }

    public IntList getIndicesOfCoveringRules() {
        return indicesOfCoveringRules;
    }

    @Override
    public String toString() {
        return "ChosenClassifiedObjectResponse{" +
                "object=" + object +
                ", indicesOfCoveringRules=" + indicesOfCoveringRules +
                '}';
    }
}
