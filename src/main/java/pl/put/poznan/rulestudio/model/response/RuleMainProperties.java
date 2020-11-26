package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.rules.Rule;
import org.rulelearn.rules.RuleCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RuleMainProperties {

    @JsonProperty("ruleCharacteristics")
    private RuleCharacteristicsBean ruleCharacteristicsBean;

    @JsonProperty("rule")
    private RuleBean ruleBean;

    private RuleMainProperties() {
        //private constructor
    }

    public RuleCharacteristicsBean getRuleCharacteristicsBean() {
        return ruleCharacteristicsBean;
    }

    public RuleBean getRuleBean() {
        return ruleBean;
    }

    @Override
    public String toString() {
        return "RuleMainProperties{" +
                "ruleCharacteristicsBean=" + ruleCharacteristicsBean +
                ", ruleBean=" + ruleBean +
                '}';
    }

    public static class RuleMainPropertiesBuilder {
        private static final Logger logger = LoggerFactory.getLogger(RuleMainPropertiesBuilder.class);

        private RuleCharacteristicsBean ruleCharacteristicsBean;
        private RuleBean ruleBean;

        public static RuleMainPropertiesBuilder newInstance() {
            return new RuleMainPropertiesBuilder();
        }

        public RuleMainPropertiesBuilder setRuleCharacteristics(RuleCharacteristicsBean ruleCharacteristicsBean) {
            this.ruleCharacteristicsBean = ruleCharacteristicsBean;
            return this;
        }

        public RuleMainPropertiesBuilder setRuleBean(RuleBean ruleBean) {
            this.ruleBean = ruleBean;
            return this;
        }

        public RuleMainProperties build() {
            RuleMainProperties ruleMainProperties = new RuleMainProperties();

            ruleMainProperties.ruleBean = this.ruleBean;
            ruleMainProperties.ruleCharacteristicsBean = this.ruleCharacteristicsBean;

            return ruleMainProperties;
        }

        public RuleMainProperties build(Rule rule, RuleCharacteristics ruleCharacteristics) {
            RuleMainProperties ruleMainProperties = new RuleMainProperties();

            ruleMainProperties.ruleBean = new RuleBean(rule);
            ruleMainProperties.ruleCharacteristicsBean = new RuleCharacteristicsBean(ruleCharacteristics);

            return ruleMainProperties;
        }
    }
}
