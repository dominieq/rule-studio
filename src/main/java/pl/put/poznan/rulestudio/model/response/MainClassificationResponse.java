package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.data.Decision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.ProjectClassification;
import pl.put.poznan.rulestudio.model.parameters.ClassificationParameters;
import pl.put.poznan.rulestudio.model.response.ClassifiedObjectMainProperties.ClassifiedObjectMainPropertiesBuilder;

import java.util.Arrays;

public class MainClassificationResponse {

    private String[] objectNames;

    @JsonProperty("Objects")
    private ClassifiedObjectMainProperties[] classifiedObjectMainPropertiesArray;

    private Boolean isExternalData;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String externalDataFileName;

    @JsonProperty("isCurrentData")
    private Boolean isCurrentData;

    private String[] errorMessages;

    @JsonProperty("parameters")
    private ClassificationParameters classificationParameters;

    private String calculationsTime;

    private MainClassificationResponse() {
        //private constructor
    }

    public String[] getObjectNames() {
        return objectNames;
    }

    public ClassifiedObjectMainProperties[] getClassifiedObjectMainPropertiesArray() {
        return classifiedObjectMainPropertiesArray;
    }

    public Boolean getExternalData() {
        return isExternalData;
    }

    public String getExternalDataFileName() {
        return externalDataFileName;
    }

    @JsonIgnore
    public Boolean getCurrentData() {
        return isCurrentData;
    }

    public String[] getErrorMessages() {
        return errorMessages;
    }

    public ClassificationParameters getClassificationParameters() {
        return classificationParameters;
    }

    public String getCalculationsTime() {
        return calculationsTime;
    }

    @Override
    public String toString() {
        return "MainClassificationResponse{" +
                "objectNames=" + Arrays.toString(objectNames) +
                ", classifiedObjectMainPropertiesArray=" + Arrays.toString(classifiedObjectMainPropertiesArray) +
                ", isExternalData=" + isExternalData +
                ", externalDataFileName='" + externalDataFileName + '\'' +
                ", isCurrentData=" + isCurrentData +
                ", errorMessages=" + Arrays.toString(errorMessages) +
                ", classificationParameters=" + classificationParameters +
                ", calculationsTime='" + calculationsTime + '\'' +
                '}';
    }

    public static class MainClassificationResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(MainClassificationResponseBuilder.class);

        private String[] objectNames;
        private ClassifiedObjectMainProperties[] classifiedObjectMainPropertiesArray;
        private Boolean isExternalData;
        private String externalDataFileName;
        private Boolean isCurrentData;
        private String[] errorMessages;
        private ClassificationParameters classificationParameters;
        private String calculationsTime;

        public static MainClassificationResponseBuilder newInstance() {
            return new MainClassificationResponseBuilder();
        }

        public MainClassificationResponseBuilder setObjectNames(String[] objectNames) {
            this.objectNames = objectNames;
            return this;
        }

        public MainClassificationResponseBuilder setClassifiedObjectMainProperties(ClassifiedObjectMainProperties[] classifiedObjectMainPropertiesArray) {
            this.classifiedObjectMainPropertiesArray = classifiedObjectMainPropertiesArray;
            return this;
        }

        public MainClassificationResponseBuilder setExternalData(Boolean externalData) {
            isExternalData = externalData;
            return this;
        }

        public MainClassificationResponseBuilder setExternalDataFileName(String externalDataFileName) {
            this.externalDataFileName = externalDataFileName;
            return this;
        }

        public MainClassificationResponseBuilder setCurrentData(Boolean currentData) {
            isCurrentData = currentData;
            return this;
        }

        public MainClassificationResponseBuilder setErrorMessages(String[] errorMessages) {
            this.errorMessages = errorMessages;
            return this;
        }

        public MainClassificationResponseBuilder setClassificationParameters(ClassificationParameters classificationParameters) {
            this.classificationParameters = classificationParameters;
            return this;
        }

        public MainClassificationResponseBuilder setCalculationsTime(String calculationsTime) {
            this.calculationsTime = calculationsTime;
            return this;
        }

        public MainClassificationResponse build() {
            MainClassificationResponse mainClassificationResponse = new MainClassificationResponse();

            mainClassificationResponse.objectNames = this.objectNames;
            mainClassificationResponse.classifiedObjectMainPropertiesArray = this.classifiedObjectMainPropertiesArray;
            mainClassificationResponse.isExternalData = this.isExternalData;
            mainClassificationResponse.externalDataFileName = this.externalDataFileName;
            mainClassificationResponse.isCurrentData = this.isCurrentData;
            mainClassificationResponse.classificationParameters = this.classificationParameters;
            mainClassificationResponse.calculationsTime = this.calculationsTime;

            return mainClassificationResponse;
        }

        public MainClassificationResponse build(ProjectClassification projectClassification) {
            MainClassificationResponse mainClassificationResponse = new MainClassificationResponse();

            mainClassificationResponse.objectNames = projectClassification.getClassifiedDescriptiveAttributes().extractObjectNames(projectClassification.getClassifiedInformationTable());

            Decision originalDecision;
            final int numberOfObjects = projectClassification.getClassifiedInformationTable().getNumberOfObjects();
            mainClassificationResponse.classifiedObjectMainPropertiesArray = new ClassifiedObjectMainProperties[numberOfObjects];
            for(int i = 0; i < numberOfObjects; i++) {
                originalDecision = projectClassification.getClassifiedInformationTable().getDecision(i);
                mainClassificationResponse.classifiedObjectMainPropertiesArray[i] = ClassifiedObjectMainPropertiesBuilder.newInstance().build(projectClassification, i, originalDecision);
            }

            mainClassificationResponse.isExternalData = projectClassification.isExternalData();
            mainClassificationResponse.externalDataFileName = projectClassification.getExternalDataFileName();

            mainClassificationResponse.errorMessages = projectClassification.interpretFlags();
            mainClassificationResponse.isCurrentData = (mainClassificationResponse.errorMessages == null);

            mainClassificationResponse.classificationParameters = projectClassification.getClassificationParameters();
            mainClassificationResponse.calculationsTime = projectClassification.getCalculationsTime();

            return mainClassificationResponse;
        }
    }
}
