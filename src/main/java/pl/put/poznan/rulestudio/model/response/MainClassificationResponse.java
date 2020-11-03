package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.data.Decision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.ProjectClassification;
import pl.put.poznan.rulestudio.model.parameters.ClassificationParameters;
import pl.put.poznan.rulestudio.model.parameters.ClassificationParameters.ClassificationParametersBuilder;
import pl.put.poznan.rulestudio.model.response.ClassifiedObjectMainProperties.ClassifiedObjectMainPropertiesBuilder;

import java.util.Arrays;

public class MainClassificationResponse {

    private String[] objectNames;

    @JsonProperty("Objects")
    private ClassifiedObjectMainProperties[] classifiedObjectMainPropertiesArray;

    private Boolean isExternalData;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String externalDataFileName;

    @JsonProperty("isCurrentLearningData")
    private Boolean isCurrentLearningData;

    @JsonProperty("isCurrentRuleSet")
    private Boolean isCurrentRuleSet;

    @JsonProperty("parameters")
    private ClassificationParameters classificationParameters;

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
    public Boolean getCurrentLearningData() {
        return isCurrentLearningData;
    }

    @JsonIgnore
    public Boolean getCurrentRuleSet() {
        return isCurrentRuleSet;
    }

    public ClassificationParameters getClassificationParameters() {
        return classificationParameters;
    }

    @Override
    public String toString() {
        return "MainClassificationResponse{" +
                "objectNames=" + Arrays.toString(objectNames) +
                ", classifiedObjectMainPropertiesArray=" + Arrays.toString(classifiedObjectMainPropertiesArray) +
                ", isExternalData=" + isExternalData +
                ", externalDataFileName='" + externalDataFileName + '\'' +
                ", isCurrentLearningData=" + isCurrentLearningData +
                ", isCurrentRuleSet=" + isCurrentRuleSet +
                ", classificationParameters=" + classificationParameters +
                '}';
    }

    public static class MainClassificationResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(MainClassificationResponseBuilder.class);

        private String[] objectNames;
        private ClassifiedObjectMainProperties[] classifiedObjectMainPropertiesArray;
        private Boolean isExternalData;
        private String externalDataFileName;
        private Boolean isCurrentLearningData;
        private Boolean isCurrentRuleSet;
        private ClassificationParameters classificationParameters;

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

        public MainClassificationResponseBuilder setCurrentLearningData(Boolean currentLearningData) {
            isCurrentLearningData = currentLearningData;
            return this;
        }

        public MainClassificationResponseBuilder setCurrentRuleSet(Boolean currentRuleSet) {
            isCurrentRuleSet = currentRuleSet;
            return this;
        }

        public MainClassificationResponseBuilder setClassificationParameters(ClassificationParameters classificationParameters) {
            this.classificationParameters = classificationParameters;
            return this;
        }

        public MainClassificationResponse build() {
            MainClassificationResponse mainClassificationResponse = new MainClassificationResponse();

            mainClassificationResponse.objectNames = this.objectNames;
            mainClassificationResponse.classifiedObjectMainPropertiesArray = this.classifiedObjectMainPropertiesArray;
            mainClassificationResponse.isExternalData = this.isExternalData;
            mainClassificationResponse.externalDataFileName = this.externalDataFileName;
            mainClassificationResponse.isCurrentLearningData = this.isCurrentLearningData;
            mainClassificationResponse.isCurrentRuleSet = this.isCurrentRuleSet;
            mainClassificationResponse.classificationParameters = this.classificationParameters;

            return mainClassificationResponse;
        }

        public MainClassificationResponse build(ProjectClassification projectClassification) {
            MainClassificationResponse mainClassificationResponse = new MainClassificationResponse();

            mainClassificationResponse.objectNames = projectClassification.getDescriptiveAttributes().extractObjectNames(projectClassification.getClassifiedInformationTable());

            Decision originalDecision;
            final int numberOfObjects = projectClassification.getClassifiedInformationTable().getNumberOfObjects();
            mainClassificationResponse.classifiedObjectMainPropertiesArray = new ClassifiedObjectMainProperties[numberOfObjects];
            for(int i = 0; i < numberOfObjects; i++) {
                originalDecision = projectClassification.getClassifiedInformationTable().getDecision(i);
                mainClassificationResponse.classifiedObjectMainPropertiesArray[i] = ClassifiedObjectMainPropertiesBuilder.newInstance().build(projectClassification, i, originalDecision);
            }

            mainClassificationResponse.isExternalData = projectClassification.isExternalData();
            mainClassificationResponse.externalDataFileName = projectClassification.getExternalDataFileName();
            mainClassificationResponse.isCurrentLearningData = projectClassification.isCurrentLearningData();
            mainClassificationResponse.isCurrentRuleSet = projectClassification.isCurrentRuleSet();

            mainClassificationResponse.classificationParameters = ClassificationParametersBuilder.newInstance().build(projectClassification);

            return mainClassificationResponse;
        }
    }
}
