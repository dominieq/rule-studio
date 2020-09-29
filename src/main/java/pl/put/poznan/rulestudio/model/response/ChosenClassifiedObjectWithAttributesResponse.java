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

public class ChosenClassifiedObjectWithAttributesResponse extends ChosenClassifiedObjectAbstractResponse {

    private LinkedHashMap<String, String> object;

    private IntList indicesOfCoveringRules;

    @JsonRawValue
    private String attributes;

    private ChosenClassifiedObjectWithAttributesResponse() {
        //private constructor
    }

    public LinkedHashMap<String, String> getObject() {
        return object;
    }

    public IntList getIndicesOfCoveringRules() {
        return indicesOfCoveringRules;
    }

    public String getAttributes() {
        return attributes;
    }

    @Override
    public String toString() {
        return "ChosenClassifiedObjectWithAttributesResponse{" +
                "object=" + object +
                ", indicesOfCoveringRules=" + indicesOfCoveringRules +
                ", attributes='" + attributes + '\'' +
                '}';
    }

    public static class ChosenClassifiedObjectWithAttributesResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ChosenClassifiedObjectWithAttributesResponseBuilder.class);

        private LinkedHashMap<String, String> object;
        private IntList indicesOfCoveringRules;
        private String attributes;

        public static ChosenClassifiedObjectWithAttributesResponseBuilder newInstance() {
            return new ChosenClassifiedObjectWithAttributesResponseBuilder();
        }

        public ChosenClassifiedObjectWithAttributesResponseBuilder setObject(LinkedHashMap<String, String> object) {
            this.object = object;
            return this;
        }

        public ChosenClassifiedObjectWithAttributesResponseBuilder setIndicesOfCoveringRules(IntList indicesOfCoveringRules) {
            this.indicesOfCoveringRules = indicesOfCoveringRules;
            return this;
        }

        public ChosenClassifiedObjectWithAttributesResponseBuilder setAttributes(String attributes) {
            this.attributes = attributes;
            return this;
        }

        public ChosenClassifiedObjectWithAttributesResponse build() {
            ChosenClassifiedObjectWithAttributesResponse chosenClassifiedObjectWithAttributesResponse = new ChosenClassifiedObjectWithAttributesResponse();

            chosenClassifiedObjectWithAttributesResponse.object = this.object;
            chosenClassifiedObjectWithAttributesResponse.indicesOfCoveringRules = this.indicesOfCoveringRules;
            chosenClassifiedObjectWithAttributesResponse.attributes = this.attributes;

            return chosenClassifiedObjectWithAttributesResponse;
        }

        public ChosenClassifiedObjectWithAttributesResponse build(Classification classification, Integer classifiedObjectIndex) throws IOException {
            ChosenClassifiedObjectWithAttributesResponse chosenClassifiedObjectWithAttributesResponse = new ChosenClassifiedObjectWithAttributesResponse();

            final InformationTable classifiedInformationTable = classification.getInformationTable();
            if((classifiedObjectIndex < 0) || (classifiedObjectIndex >= classifiedInformationTable.getNumberOfObjects())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given object's index \"%d\" is incorrect. You can choose object from %d to %d", classifiedObjectIndex, 0, classifiedInformationTable.getNumberOfObjects() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            Field[] fields = classifiedInformationTable.getFields(classifiedObjectIndex);
            chosenClassifiedObjectWithAttributesResponse.object = new LinkedHashMap<>();
            for(int i = 0; i < classifiedInformationTable.getNumberOfAttributes(); i++) {
                chosenClassifiedObjectWithAttributesResponse.object.put(classifiedInformationTable.getAttribute(i).getName(), fields[i].toString());
            }

            chosenClassifiedObjectWithAttributesResponse.indicesOfCoveringRules = classification.getIndicesOfCoveringRules()[classifiedObjectIndex];

            StringWriter attributesWriter = new StringWriter();
            InformationTableWriter itw = new InformationTableWriter(false);
            itw.writeAttributes(classifiedInformationTable, attributesWriter);
            chosenClassifiedObjectWithAttributesResponse.attributes = attributesWriter.toString();

            return chosenClassifiedObjectWithAttributesResponse;
        }
    }
}
