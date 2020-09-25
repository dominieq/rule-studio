package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.RulesWithHttpParameters;
import pl.put.poznan.rulestudio.model.ValidityRulesContainer;
import pl.put.poznan.rulestudio.model.parameters.RulesParameters;
import pl.put.poznan.rulestudio.model.parameters.RulesParameters.RulesParametersBuilder;
import pl.put.poznan.rulestudio.model.response.RuleMainProperties.RuleMainPropertiesBuilder;

import java.util.Arrays;

public class MainRulesResponse {

    private RuleMainProperties[] ruleMainPropertiesArray;

    @JsonProperty("parameters")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private RulesParameters rulesParameters;

    @JsonProperty("isCurrentData")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isCurrentData;

    private Boolean externalRules;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String externalRulesFileName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String errorMessage;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ValidityRulesContainer validityRulesContainer;

    private MainRulesResponse() {
        //private constructor
    }

    public RuleMainProperties[] getRuleMainPropertiesArray() {
        return ruleMainPropertiesArray;
    }

    public RulesParameters getRulesParameters() {
        return rulesParameters;
    }

    @JsonIgnore
    public Boolean getCurrentData() {
        return isCurrentData;
    }

    public Boolean getExternalRules() {
        return externalRules;
    }

    public String getExternalRulesFileName() {
        return externalRulesFileName;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public ValidityRulesContainer getValidityRulesContainer() {
        return validityRulesContainer;
    }

    @Override
    public String toString() {
        return "MainRulesResponse{" +
                "ruleMainPropertiesArray=" + Arrays.toString(ruleMainPropertiesArray) +
                ", rulesParameters=" + rulesParameters +
                ", isCurrentData=" + isCurrentData +
                ", externalRules=" + externalRules +
                ", externalRulesFileName='" + externalRulesFileName + '\'' +
                ", errorMessage='" + errorMessage + '\'' +
                ", validityRulesContainer=" + validityRulesContainer +
                '}';
    }

    public static class MainRulesResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(MainClassUnionsResponse.class);

        private RuleMainProperties[] ruleMainPropertiesArray;
        private RulesParameters rulesParameters;
        private Boolean isCurrentData;
        private Boolean externalRules;
        private String externalRulesFileName;
        private String errorMessage;
        private ValidityRulesContainer validityRulesContainer;

        public static MainRulesResponseBuilder newInstance() {
            return new MainRulesResponseBuilder();
        }

        public MainRulesResponseBuilder setRuleMainPropertiesArray(RuleMainProperties[] ruleMainPropertiesArray) {
            this.ruleMainPropertiesArray = ruleMainPropertiesArray;
            return this;
        }

        public MainRulesResponseBuilder setRulesParameters(RulesParameters rulesParameters) {
            this.rulesParameters = rulesParameters;
            return this;
        }

        public MainRulesResponseBuilder setCurrentData(Boolean currentData) {
            isCurrentData = currentData;
            return this;
        }

        public MainRulesResponseBuilder setExternalRules(Boolean externalRules) {
            this.externalRules = externalRules;
            return this;
        }

        public MainRulesResponseBuilder setExternalRulesFileName(String externalRulesFileName) {
            this.externalRulesFileName = externalRulesFileName;
            return this;
        }

        public MainRulesResponseBuilder setErrorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        }

        public MainRulesResponseBuilder setValidityRulesContainer(ValidityRulesContainer validityRulesContainer) {
            this.validityRulesContainer = validityRulesContainer;
            return this;
        }

        public MainRulesResponse build() {
            MainRulesResponse mainRulesResponse = new MainRulesResponse();

            mainRulesResponse.ruleMainPropertiesArray = this.ruleMainPropertiesArray;
            mainRulesResponse.rulesParameters = this.rulesParameters;
            mainRulesResponse.isCurrentData = this.isCurrentData;
            mainRulesResponse.externalRules = this.externalRules;
            mainRulesResponse.externalRulesFileName = this.externalRulesFileName;
            mainRulesResponse.errorMessage = this.errorMessage;
            mainRulesResponse.validityRulesContainer = this.validityRulesContainer;

            return mainRulesResponse;
        }

        public MainRulesResponse build(RulesWithHttpParameters rulesWithHttpParameters) {
            MainRulesResponse mainRulesResponse = new MainRulesResponse();

            final RuleSetWithCharacteristics rules = rulesWithHttpParameters.getRuleSet();
            final int numberOfRules = rules.size();
            mainRulesResponse.ruleMainPropertiesArray = new RuleMainProperties[numberOfRules];
            for(int i = 0; i < numberOfRules; i++) {
                mainRulesResponse.ruleMainPropertiesArray[i] = RuleMainPropertiesBuilder.newInstance().build(rules.getRule(i), rules.getRuleCharacteristics(i));
            }

            mainRulesResponse.rulesParameters = RulesParametersBuilder.newInstance().build(rulesWithHttpParameters);
            mainRulesResponse.isCurrentData = rulesWithHttpParameters.isCurrentData();
            mainRulesResponse.externalRules = rulesWithHttpParameters.isExternalRules();
            mainRulesResponse.externalRulesFileName = rulesWithHttpParameters.getRulesFileName();
            mainRulesResponse.errorMessage = rulesWithHttpParameters.getErrorMessage();
            mainRulesResponse.validityRulesContainer = rulesWithHttpParameters.getValidityRulesContainer();

            return mainRulesResponse;
        }
    }
}
