package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.data.Decision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.CrossValidation;
import pl.put.poznan.rulestudio.model.CrossValidationSingleFold;
import pl.put.poznan.rulestudio.model.response.ClassifiedObjectMainProperties.ClassifiedObjectMainPropertiesBuilder;

import java.util.Arrays;

public class ChosenCrossValidationFoldResponse {

    private String[] objectNames;

    @JsonProperty("Objects")
    private ClassifiedObjectMainProperties[] classifiedObjectMainPropertiesArray;

    private Integer numberOfTrainingObjects;

    private Integer numberOfRules;

    private Integer numberOfTestObjects;

    private ChosenCrossValidationFoldResponse() {
        //private constructor
    }

    public String[] getObjectNames() {
        return objectNames;
    }

    public ClassifiedObjectMainProperties[] getClassifiedObjectMainPropertiesArray() {
        return classifiedObjectMainPropertiesArray;
    }

    public Integer getNumberOfTrainingObjects() {
        return numberOfTrainingObjects;
    }

    public Integer getNumberOfRules() {
        return numberOfRules;
    }

    public Integer getNumberOfTestObjects() {
        return numberOfTestObjects;
    }

    @Override
    public String toString() {
        return "ChosenCrossValidationFoldResponse{" +
                "objectNames=" + Arrays.toString(objectNames) +
                ", classifiedObjectMainPropertiesArray=" + Arrays.toString(classifiedObjectMainPropertiesArray) +
                ", numberOfTrainingObjects=" + numberOfTrainingObjects +
                ", numberOfRules=" + numberOfRules +
                ", numberOfTestObjects=" + numberOfTestObjects +
                '}';
    }

    public static class ChosenCrossValidationFoldResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ChosenCrossValidationFoldResponseBuilder.class);

        private String[] objectNames;
        private ClassifiedObjectMainProperties[] classifiedObjectMainPropertiesArray;
        private Integer numberOfTrainingObjects;
        private Integer numberOfRules;
        private Integer numberOfTestObjects;

        public static ChosenCrossValidationFoldResponseBuilder newInstance() {
            return new ChosenCrossValidationFoldResponseBuilder();
        }

        public ChosenCrossValidationFoldResponseBuilder setObjectNames(String[] objectNames) {
            this.objectNames = objectNames;
            return this;
        }

        public ChosenCrossValidationFoldResponseBuilder setClassifiedObjectMainPropertiesArray(ClassifiedObjectMainProperties[] classifiedObjectMainPropertiesArray) {
            this.classifiedObjectMainPropertiesArray = classifiedObjectMainPropertiesArray;
            return this;
        }

        public ChosenCrossValidationFoldResponseBuilder setNumberOfTrainingObjects(Integer numberOfTrainingObjects) {
            this.numberOfTrainingObjects = numberOfTrainingObjects;
            return this;
        }

        public ChosenCrossValidationFoldResponseBuilder setNumberOfRules(Integer numberOfRules) {
            this.numberOfRules = numberOfRules;
            return this;
        }

        public ChosenCrossValidationFoldResponseBuilder setNumberOfTestObjects(Integer numberOfTestObjects) {
            this.numberOfTestObjects = numberOfTestObjects;
            return this;
        }

        public ChosenCrossValidationFoldResponse build() {
            ChosenCrossValidationFoldResponse chosenCrossValidationFoldResponse = new ChosenCrossValidationFoldResponse();

            chosenCrossValidationFoldResponse.objectNames = this.objectNames;
            chosenCrossValidationFoldResponse.classifiedObjectMainPropertiesArray = this.classifiedObjectMainPropertiesArray;
            chosenCrossValidationFoldResponse.numberOfTrainingObjects = this.numberOfTrainingObjects;
            chosenCrossValidationFoldResponse.numberOfRules = this.numberOfRules;
            chosenCrossValidationFoldResponse.numberOfTestObjects = this.numberOfTestObjects;

            return chosenCrossValidationFoldResponse;
        }

        public ChosenCrossValidationFoldResponse build(CrossValidation crossValidation, Integer foldIndex) {
            if((foldIndex < 0) || (foldIndex >= crossValidation.getCrossValidationParameters().getNumberOfFolds())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given fold's index \"%d\" is incorrect. You can choose fold from %d to %d", foldIndex, 0, crossValidation.getCrossValidationParameters().getNumberOfFolds() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            CrossValidationSingleFold crossValidationSingleFold = crossValidation.getCrossValidationSingleFolds()[foldIndex];

            ChosenCrossValidationFoldResponse chosenCrossValidationFoldResponse = new ChosenCrossValidationFoldResponse();

            chosenCrossValidationFoldResponse.objectNames = crossValidation.getDescriptiveAttributes().extractChosenObjectNames(crossValidation.getInformationTable(), crossValidationSingleFold.getIndicesOfValidationObjects());

            Decision originalDecision;
            final int numberOfObjects = crossValidationSingleFold.getIndicesOfValidationObjects().length;
            chosenCrossValidationFoldResponse.classifiedObjectMainPropertiesArray = new ClassifiedObjectMainProperties[numberOfObjects];
            for(int i = 0; i < numberOfObjects; i++) {
                originalDecision = crossValidation.getInformationTable().getDecision( crossValidationSingleFold.getIndicesOfValidationObjects()[i] );
                chosenCrossValidationFoldResponse.classifiedObjectMainPropertiesArray[i] = ClassifiedObjectMainPropertiesBuilder.newInstance().build(crossValidationSingleFold.getFoldClassification(), i, originalDecision);
            }

            chosenCrossValidationFoldResponse.numberOfTrainingObjects = crossValidationSingleFold.getIndicesOfTrainingObjects().length;
            chosenCrossValidationFoldResponse.numberOfRules = crossValidationSingleFold.getRuLeStudioRuleSet().getRuLeStudioRules().length;
            chosenCrossValidationFoldResponse.numberOfTestObjects = crossValidationSingleFold.getIndicesOfValidationObjects().length;

            return chosenCrossValidationFoldResponse;
        }
    }
}
