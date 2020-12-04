package pl.put.poznan.rulestudio.model.parameters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.model.RulesWithHttpParameters;

public class RulesParameters {

    private UnionType typeOfUnions;

    private Double consistencyThreshold;

    private RuleType typeOfRules;

    private RulesParameters() {
        //private constructor
    }

    public UnionType getTypeOfUnions() {
        return typeOfUnions;
    }

    public Double getConsistencyThreshold() {
        return consistencyThreshold;
    }

    public RuleType getTypeOfRules() {
        return typeOfRules;
    }

    @Override
    public String toString() {
        return "RulesParameters{" +
                "typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                ", typeOfRules=" + typeOfRules +
                '}';
    }

    public static class RulesParametersBuilder {
        private static final Logger logger = LoggerFactory.getLogger(RulesParametersBuilder.class);

        private UnionType typeOfUnions;
        private Double consistencyThreshold;
        private RuleType typeOfRules;

        public static RulesParametersBuilder newInstance() {
            return new RulesParametersBuilder();
        }

        public RulesParametersBuilder setTypeOfUnions(UnionType typeOfUnions) {
            this.typeOfUnions = typeOfUnions;
            return this;
        }

        public RulesParametersBuilder setConsistencyThreshold(Double consistencyThreshold) {
            this.consistencyThreshold = consistencyThreshold;
            return this;
        }

        public RulesParametersBuilder setTypeOfRules(RuleType typeOfRules) {
            this.typeOfRules = typeOfRules;
            return this;
        }

        public RulesParameters build() {
            RulesParameters rulesParameters = new RulesParameters();

            rulesParameters.typeOfUnions = this.typeOfUnions;
            rulesParameters.consistencyThreshold = this.consistencyThreshold;
            rulesParameters.typeOfRules = this.typeOfRules;

            return rulesParameters;
        }

        public RulesParameters build(RulesWithHttpParameters rulesWithHttpParameters) {
            if(rulesWithHttpParameters.getTypeOfUnions() == null) {
                return null;
            }

            RulesParameters rulesParameters = new RulesParameters();

            rulesParameters.typeOfUnions = rulesWithHttpParameters.getTypeOfUnions();
            rulesParameters.consistencyThreshold = rulesWithHttpParameters.getConsistencyThreshold();
            rulesParameters.typeOfRules = rulesWithHttpParameters.getTypeOfRules();

            return rulesParameters;
        }
    }
}
