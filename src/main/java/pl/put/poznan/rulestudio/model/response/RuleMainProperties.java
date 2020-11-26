package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.rules.Rule;
import org.rulelearn.rules.RuleCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RuleMainProperties {

    @JsonProperty("ruleCharacteristics")
    private RuleCharacteristicsBean ruleCharacteristicsBean;

    private Rule rule;

    private RuleMainProperties() {
        //private constructor
    }

    public RuleCharacteristicsBean getRuleCharacteristicsBean() {
        return ruleCharacteristicsBean;
    }

    public Rule getRule() {
        return rule;
    }

    @Override
    public String toString() {
        return "RuleMainProperties{" +
                "ruleCharacteristicsBean=" + ruleCharacteristicsBean +
                ", rule=" + rule +
                '}';
    }

    public static class RuleMainPropertiesBuilder {
        private static final Logger logger = LoggerFactory.getLogger(RuleMainPropertiesBuilder.class);

        private RuleCharacteristicsBean ruleCharacteristicsBean;
        private Rule rule;

        public static RuleMainPropertiesBuilder newInstance() {
            return new RuleMainPropertiesBuilder();
        }

        public RuleMainPropertiesBuilder setRuleCharacteristics(RuleCharacteristicsBean ruleCharacteristicsBean) {
            this.ruleCharacteristicsBean = ruleCharacteristicsBean;
            return this;
        }

        public RuleMainPropertiesBuilder setRule(Rule rule) {
            this.rule = rule;
            return this;
        }

        public RuleMainProperties build() {
            RuleMainProperties ruleMainProperties = new RuleMainProperties();

            ruleMainProperties.rule = this.rule;
            ruleMainProperties.ruleCharacteristicsBean = this.ruleCharacteristicsBean;

            return ruleMainProperties;
        }

        public RuleMainProperties build(Rule rule, RuleCharacteristics ruleCharacteristics) {
            RuleMainProperties ruleMainProperties = new RuleMainProperties();

            ruleMainProperties.rule = rule;
            ruleMainProperties.ruleCharacteristicsBean = new RuleCharacteristicsBean(ruleCharacteristics);

            return ruleMainProperties;
        }
    }
}
