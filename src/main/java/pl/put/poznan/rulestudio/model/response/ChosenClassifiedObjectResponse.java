package pl.put.poznan.rulestudio.model.response;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.data.InformationTable;
import org.rulelearn.types.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.Classification;

import java.util.LinkedHashMap;

public class ChosenClassifiedObjectResponse extends ChosenClassifiedObjectAbstractResponse {
    private static final Logger logger = LoggerFactory.getLogger(ChosenClassifiedObjectResponse.class);

    private LinkedHashMap<String, String> object;

    private IntList indicesOfCoveringRules;

    public ChosenClassifiedObjectResponse(Classification classification, Integer classifiedObjectIndex) {
        final InformationTable classifiedInformationTable = classification.getInformationTable();
        if((classifiedObjectIndex < 0) || (classifiedObjectIndex >= classifiedInformationTable.getNumberOfObjects())) {
            WrongParameterException ex = new WrongParameterException(String.format("Given object's index \"%d\" is incorrect. You can choose object from %d to %d", classifiedObjectIndex, 0, classifiedInformationTable.getNumberOfObjects() - 1));
            logger.error(ex.getMessage());
            throw ex;
        }

        Field[] fields = classifiedInformationTable.getFields(classifiedObjectIndex);
        this.object = new LinkedHashMap<>();
        for(int i = 0; i < classifiedInformationTable.getNumberOfAttributes(); i++) {
            this.object.put(classifiedInformationTable.getAttribute(i).getName(), fields[i].toString());
        }

        this.indicesOfCoveringRules = classification.getIndicesOfCoveringRules()[classifiedObjectIndex];
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
