package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonValue;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.response.RuleMainProperties.RuleMainPropertiesBuilder;

public class RuleMainPropertiesResponse {

    @JsonValue
    private RuleMainProperties ruleMainProperties;

    private RuleMainPropertiesResponse() {
        //private constructor
    }

    public RuleMainProperties getRuleMainProperties() {
        return ruleMainProperties;
    }

    @Override
    public String toString() {
        return "RuleMainPropertiesResponse{" +
                "ruleMainProperties=" + ruleMainProperties +
                '}';
    }

    public static class RuleMainPropertiesResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(RuleMainPropertiesResponseBuilder.class);

        private RuleMainProperties ruleMainProperties;

        public static RuleMainPropertiesResponseBuilder newInstance() {
            return new RuleMainPropertiesResponseBuilder();
        }

        public RuleMainPropertiesResponseBuilder setRuleMainProperties(RuleMainProperties ruleMainProperties) {
            this.ruleMainProperties = ruleMainProperties;
            return this;
        }

        public RuleMainPropertiesResponse build() {
            RuleMainPropertiesResponse ruleMainPropertiesResponse = new RuleMainPropertiesResponse();

            ruleMainPropertiesResponse.ruleMainProperties = this.ruleMainProperties;

            return ruleMainPropertiesResponse;
        }

        public RuleMainPropertiesResponse build(RuleSetWithCharacteristics ruleSetWithCharacteristics, Integer ruleIndex) {
            if((ruleIndex < 0) || (ruleIndex >= ruleSetWithCharacteristics.size())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given rule's index \"%d\" is incorrect. You can choose rule from %d to %d", ruleIndex, 0, ruleSetWithCharacteristics.size() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            RuleMainPropertiesResponse ruleMainPropertiesResponse = new RuleMainPropertiesResponse();

            ruleMainPropertiesResponse.ruleMainProperties = RuleMainPropertiesBuilder.newInstance().build(ruleSetWithCharacteristics.getRule(ruleIndex), ruleSetWithCharacteristics.getRuleCharacteristics(ruleIndex));

            return ruleMainPropertiesResponse;
        }
    }
}
