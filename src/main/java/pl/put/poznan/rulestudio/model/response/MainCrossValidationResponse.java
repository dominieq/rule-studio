package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.CrossValidation;
import pl.put.poznan.rulestudio.model.parameters.CrossValidationParameters;

public class MainCrossValidationResponse {

    @JsonProperty("isCurrentData")
    private Boolean isCurrentData;

    @JsonProperty("parameters")
    private CrossValidationParameters crossValidationParameters;

    private String calculationsTime;

    private MainCrossValidationResponse() {
        //private constructor
    }

    @JsonIgnore
    public Boolean getCurrentData() {
        return isCurrentData;
    }

    public CrossValidationParameters getCrossValidationParameters() {
        return crossValidationParameters;
    }

    public String getCalculationsTime() {
        return calculationsTime;
    }

    @Override
    public String toString() {
        return "MainCrossValidationResponse{" +
                "isCurrentData=" + isCurrentData +
                ", crossValidationParameters=" + crossValidationParameters +
                ", calculationsTime='" + calculationsTime + '\'' +
                '}';
    }

    public static class MainCrossValidationResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(MainCrossValidationResponseBuilder.class);

        private Boolean isCurrentData;
        private CrossValidationParameters crossValidationParameters;
        private String calculationsTime;

        public static MainCrossValidationResponseBuilder newInstance() {
            return new MainCrossValidationResponseBuilder();
        }

        public MainCrossValidationResponseBuilder setCurrentData(Boolean currentData) {
            isCurrentData = currentData;
            return this;
        }

        public MainCrossValidationResponseBuilder setCrossValidationParameters(CrossValidationParameters crossValidationParameters) {
            this.crossValidationParameters = crossValidationParameters;
            return this;
        }

        public MainCrossValidationResponseBuilder setCalculationsTime(String calculationsTime) {
            this.calculationsTime = calculationsTime;
            return this;
        }

        public MainCrossValidationResponse build() {
            MainCrossValidationResponse mainCrossValidationResponse = new MainCrossValidationResponse();

            mainCrossValidationResponse.isCurrentData = this.isCurrentData;
            mainCrossValidationResponse.crossValidationParameters = this.crossValidationParameters;
            mainCrossValidationResponse.calculationsTime = this.calculationsTime;

            return mainCrossValidationResponse;
        }

        public MainCrossValidationResponse build(CrossValidation crossValidation) {
            MainCrossValidationResponse mainCrossValidationResponse = new MainCrossValidationResponse();

            mainCrossValidationResponse.isCurrentData = crossValidation.isCurrentData();
            mainCrossValidationResponse.crossValidationParameters = crossValidation.getCrossValidationParameters();
            mainCrossValidationResponse.calculationsTime = crossValidation.getCalculationsTime();

            return mainCrossValidationResponse;
        }
    }
}
