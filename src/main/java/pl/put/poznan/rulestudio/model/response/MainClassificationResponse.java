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

import java.util.ArrayList;
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

        public MainClassificationResponse build() {
            MainClassificationResponse mainClassificationResponse = new MainClassificationResponse();

            mainClassificationResponse.objectNames = this.objectNames;
            mainClassificationResponse.classifiedObjectMainPropertiesArray = this.classifiedObjectMainPropertiesArray;
            mainClassificationResponse.isExternalData = this.isExternalData;
            mainClassificationResponse.externalDataFileName = this.externalDataFileName;
            mainClassificationResponse.isCurrentData = this.isCurrentData;
            mainClassificationResponse.classificationParameters = this.classificationParameters;

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

            if ((projectClassification.isCurrentProjectData())
                    && (projectClassification.isCurrentRuleSet() != null) && (projectClassification.isCurrentRuleSet())
                    && (projectClassification.isOriginalLearningData())
                    && (projectClassification.isCurrentLearningData())) {
                mainClassificationResponse.isCurrentData = true;
                mainClassificationResponse.errorMessages = null;
            } else {
                ArrayList<String> errorMessages = new ArrayList<>();

                if (!projectClassification.isCurrentProjectData()) {
                    if (projectClassification.isExternalData()) {
                        errorMessages.add("Classified objects have been read with different metadata than current metadata in DATA tab.");
                    } else {
                        errorMessages.add("Classified objects are different from objects in DATA tab.");
                    }
                }

                if (projectClassification.isCurrentRuleSet() == null) {
                    errorMessages.add("Rule set used in classification is different from current rule set in RULES tab. Actually, there is no rule set in RULES tab.");
                } else if (!projectClassification.isCurrentRuleSet()) {
                    errorMessages.add("Rule set used in classification is different from current rule set in RULES tab");
                }

                if (!projectClassification.isOriginalLearningData()) {
                    errorMessages.add("Rule set used in classification hadn't had access to real learning data. Actual data at that moment in DATA tab has been taken as a learning data.");
                }

                if (!projectClassification.isCurrentLearningData()) {
                    if (projectClassification.isOriginalLearningData()) {
                        errorMessages.add("Learning data is different from current data in DATA tab.");
                    } else {
                        errorMessages.add("Data used in classification as a learning data of rules is not the same as current data in DATA tab.");
                    }
                }

                mainClassificationResponse.isCurrentData = false;
                mainClassificationResponse.errorMessages = errorMessages.toArray(new String[0]);
            }

            mainClassificationResponse.classificationParameters = ClassificationParametersBuilder.newInstance().build(projectClassification);

            return mainClassificationResponse;
        }
    }
}
