package pl.put.poznan.rulestudio.model.response;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.data.InformationTable;
import org.rulelearn.types.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.Classification;

import java.util.LinkedHashMap;

public class ChosenClassifiedObjectResponse {

    private LinkedHashMap<String, String> object;

    private IntList indicesOfCoveringRules;

    private ChosenClassifiedObjectResponse() {
        //private constructor
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

    public static class ChosenClassifiedObjectResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ChosenClassifiedObjectResponseBuilder.class);

        private LinkedHashMap<String, String> object;
        private IntList indicesOfCoveringRules;

        public static ChosenClassifiedObjectResponseBuilder newInstance() {
            return new ChosenClassifiedObjectResponseBuilder();
        }

        public ChosenClassifiedObjectResponseBuilder setObject(LinkedHashMap<String, String> object) {
            this.object = object;
            return this;
        }

        public ChosenClassifiedObjectResponseBuilder setIndicesOfCoveringRules(IntList indicesOfCoveringRules) {
            this.indicesOfCoveringRules = indicesOfCoveringRules;
            return this;
        }

        public ChosenClassifiedObjectResponse build() {
            ChosenClassifiedObjectResponse chosenClassifiedObjectResponse = new ChosenClassifiedObjectResponse();

            chosenClassifiedObjectResponse.object = this.object;
            chosenClassifiedObjectResponse.indicesOfCoveringRules = this.indicesOfCoveringRules;

            return chosenClassifiedObjectResponse;
        }

        public ChosenClassifiedObjectResponse build(Classification classification, Integer classifiedObjectIndex) {
            ChosenClassifiedObjectResponse chosenClassifiedObjectResponse = new ChosenClassifiedObjectResponse();

            final InformationTable classifiedInformationTable = classification.getInformationTable();
            if((classifiedObjectIndex < 0) || (classifiedObjectIndex >= classifiedInformationTable.getNumberOfObjects())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given object's index \"%d\" is incorrect. You can choose object from %d to %d", classifiedObjectIndex, 0, classifiedInformationTable.getNumberOfObjects() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            Field[] fields = classifiedInformationTable.getFields(classifiedObjectIndex);
            chosenClassifiedObjectResponse.object = new LinkedHashMap<>();
            for(int i = 0; i < classifiedInformationTable.getNumberOfAttributes(); i++) {
                chosenClassifiedObjectResponse.object.put(classifiedInformationTable.getAttribute(i).getName(), fields[i].toString());
            }

            chosenClassifiedObjectResponse.indicesOfCoveringRules = classification.getIndicesOfCoveringRules()[classifiedObjectIndex];

            return chosenClassifiedObjectResponse;
        }
    }
}
