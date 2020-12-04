package pl.put.poznan.rulestudio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Arrays;

public class ValidityRulesContainer {

    @JsonProperty("unions")
    private UnionsValidity unionsValidity;

    @JsonProperty("classification")
    private ClassificationValidity classificationValidity;

    public ValidityRulesContainer(Project project) {
        final UnionsWithHttpParameters unions = project.getUnions();
        if (unions != null) {
            this.unionsValidity = new UnionsValidity(unions);
        } else {
            this.unionsValidity = null;
        }

        final ProjectClassification projectClassification = project.getProjectClassification();
        if (projectClassification != null) {
            this.classificationValidity = new ClassificationValidity(projectClassification);
        } else {
            this.classificationValidity = null;
        }
    }

    public UnionsValidity getUnionsValidity() {
        return unionsValidity;
    }

    public ClassificationValidity getClassificationValidity() {
        return classificationValidity;
    }

    @Override
    public String toString() {
        return "ValidityRulesContainer{" +
                "unionsValidity=" + unionsValidity +
                ", classificationValidity=" + classificationValidity +
                '}';
    }

    private class UnionsValidity {

        @JsonProperty("isCurrentData")
        private Boolean isCurrentData;

        public UnionsValidity(UnionsWithHttpParameters unions) {
            this.isCurrentData = unions.isCurrentData();
        }

        @JsonIgnore
        public Boolean getCurrentData() {
            return isCurrentData;
        }

        @Override
        public String toString() {
            return "UnionsValidity{" +
                    "isCurrentData=" + isCurrentData +
                    '}';
        }
    }

    private class ClassificationValidity {

        private Boolean externalData;

        @JsonProperty("isCurrentData")
        private Boolean isCurrentData;

        private String[] errorMessages;

        public ClassificationValidity(ProjectClassification projectClassification) {
            this.externalData = projectClassification.isExternalData();

            this.errorMessages = projectClassification.interpretFlags();
            this.isCurrentData = (this.errorMessages == null);
        }

        public Boolean getExternalData() {
            return externalData;
        }

        @JsonIgnore
        public Boolean getCurrentData() {
            return isCurrentData;
        }

        public String[] getErrorMessages() {
            return errorMessages;
        }

        @Override
        public String toString() {
            return "ClassificationValidity{" +
                    "externalData=" + externalData +
                    ", isCurrentData=" + isCurrentData +
                    ", errorMessages=" + Arrays.toString(errorMessages) +
                    '}';
        }
    }
}
