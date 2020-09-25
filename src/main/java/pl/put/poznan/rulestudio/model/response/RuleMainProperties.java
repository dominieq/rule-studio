package pl.put.poznan.rulestudio.model.response;

import org.rulelearn.rules.Rule;
import org.rulelearn.rules.RuleCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RuleMainProperties {

    private RuleCharacteristics ruleCharacteristics;

    private Rule rule;

    private RuleMainProperties() {
        //private constructor
    }

    public RuleCharacteristics getRuleCharacteristics() {
        return ruleCharacteristics;
    }

    public Rule getRule() {
        return rule;
    }

    @Override
    public String toString() {
        return "RuleMainProperties{" +
                "ruleCharacteristics=" + ruleCharacteristics +
                ", rule=" + rule +
                '}';
    }

    public static class RuleMainPropertiesBuilder {
        private static final Logger logger = LoggerFactory.getLogger(RuleMainPropertiesBuilder.class);

        private RuleCharacteristics ruleCharacteristics;
        private Rule rule;

        public static RuleMainPropertiesBuilder newInstance() {
            return new RuleMainPropertiesBuilder();
        }

        public RuleMainPropertiesBuilder setRuleCharacteristics(RuleCharacteristics ruleCharacteristics) {
            this.ruleCharacteristics = ruleCharacteristics;
            return this;
        }

        public RuleMainPropertiesBuilder setRule(Rule rule) {
            this.rule = rule;
            return this;
        }

        public RuleMainProperties build() {
            RuleMainProperties ruleMainProperties = new RuleMainProperties();

            ruleMainProperties.rule = this.rule;
            ruleMainProperties.ruleCharacteristics = this.ruleCharacteristics;

            return ruleMainProperties;
        }

        public RuleMainProperties build(Rule rule, RuleCharacteristics ruleCharacteristics) {
            RuleMainProperties ruleMainProperties = new RuleMainProperties();

            ruleMainProperties.rule = rule;
            ruleMainProperties.ruleCharacteristics = ruleCharacteristics;

            return ruleMainProperties;
        }
    }
}
