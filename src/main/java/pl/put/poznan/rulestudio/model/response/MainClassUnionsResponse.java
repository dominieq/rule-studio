package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.approximations.Union;
import org.rulelearn.approximations.UnionWithSingleLimitingDecision;
import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.UnionsWithHttpParameters;
import pl.put.poznan.rulestudio.model.parameters.ClassUnionsParameters;
import pl.put.poznan.rulestudio.model.parameters.ClassUnionsParameters.ClassUnionsParametersBuilder;
import pl.put.poznan.rulestudio.model.response.ClassUnionMainProperties.ClassUnionMainPropertiesBuilder;

import java.util.Arrays;

public class MainClassUnionsResponse {

    @JsonProperty("Unions")
    private ClassUnionMainProperties[] classUnionMainPropertiesArray;

    private Double qualityOfApproximation;

    @JsonProperty("isCurrentData")
    private Boolean isCurrentData;

    @JsonProperty("parameters")
    private ClassUnionsParameters classUnionsParameters;

    private MainClassUnionsResponse() {
        //private constructor
    }

    public ClassUnionMainProperties[] getClassUnionMainPropertiesArray() {
        return classUnionMainPropertiesArray;
    }

    public Double getQualityOfApproximation() {
        return qualityOfApproximation;
    }

    @JsonIgnore
    public Boolean getCurrentData() {
        return isCurrentData;
    }

    public ClassUnionsParameters getClassUnionsParameters() {
        return classUnionsParameters;
    }

    @Override
    public String toString() {
        return "MainClassUnionsResponse{" +
                "classUnionMainPropertiesArray=" + Arrays.toString(classUnionMainPropertiesArray) +
                ", qualityOfApproximation=" + qualityOfApproximation +
                ", isCurrentData=" + isCurrentData +
                ", classUnionsParameters=" + classUnionsParameters +
                '}';
    }

    public static class MainClassUnionsResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(MainClassUnionsResponseBuilder.class);

        private ClassUnionMainProperties[] classUnionMainPropertiesArray;
        private Double qualityOfApproximation;
        private Boolean isCurrentData;
        private ClassUnionsParameters classUnionsParameters;

        public static MainClassUnionsResponseBuilder newInstance() {
            return new MainClassUnionsResponseBuilder();
        }

        public MainClassUnionsResponseBuilder setClassUnionMainPropertiesArray(ClassUnionMainProperties[] classUnionMainPropertiesArray) {
            this.classUnionMainPropertiesArray = classUnionMainPropertiesArray;
            return this;
        }

        public MainClassUnionsResponseBuilder setQualityOfApproximation(Double qualityOfApproximation) {
            this.qualityOfApproximation = qualityOfApproximation;
            return this;
        }

        public MainClassUnionsResponseBuilder setCurrentData(Boolean currentData) {
            isCurrentData = currentData;
            return this;
        }

        public MainClassUnionsResponseBuilder setClassUnionsParameters(ClassUnionsParameters classUnionsParameters) {
            this.classUnionsParameters = classUnionsParameters;
            return this;
        }

        public MainClassUnionsResponse build() {
            MainClassUnionsResponse mainClassUnionsResponse = new MainClassUnionsResponse();

            mainClassUnionsResponse.classUnionMainPropertiesArray = this.classUnionMainPropertiesArray;
            mainClassUnionsResponse.qualityOfApproximation = this.qualityOfApproximation;
            mainClassUnionsResponse.isCurrentData = this.isCurrentData;
            mainClassUnionsResponse.classUnionsParameters = this.classUnionsParameters;

            return mainClassUnionsResponse;
        }

        public MainClassUnionsResponse build(UnionsWithHttpParameters unionsWithHttpParameters) {
            final UnionsWithSingleLimitingDecision unions = unionsWithHttpParameters.getUnions();
            MainClassUnionsResponse mainClassUnionsResponse = new MainClassUnionsResponse();

            final Union[] upwardUnions, downwardUnions;
            upwardUnions = unions.getUpwardUnions();
            downwardUnions = unions.getDownwardUnions();
            final int numberOfUnions = upwardUnions.length + downwardUnions.length;
            mainClassUnionsResponse.classUnionMainPropertiesArray = new ClassUnionMainProperties[numberOfUnions];
            int i, index = 0;
            for(i = 0; i < upwardUnions.length; i++) {
                mainClassUnionsResponse.classUnionMainPropertiesArray[index] = ClassUnionMainPropertiesBuilder.newInstance().build((UnionWithSingleLimitingDecision) upwardUnions[i]);
                index++;
            }
            for(i = 0; i < downwardUnions.length; i++) {
                mainClassUnionsResponse.classUnionMainPropertiesArray[index] = ClassUnionMainPropertiesBuilder.newInstance().build((UnionWithSingleLimitingDecision) downwardUnions[i]);
                index++;
            }

            mainClassUnionsResponse.qualityOfApproximation = unions.getQualityOfApproximation();
            mainClassUnionsResponse.isCurrentData = unionsWithHttpParameters.isCurrentData();

            mainClassUnionsResponse.classUnionsParameters = ClassUnionsParametersBuilder.newInstance().build(unionsWithHttpParameters);

            return mainClassUnionsResponse;
        }
    }
}
