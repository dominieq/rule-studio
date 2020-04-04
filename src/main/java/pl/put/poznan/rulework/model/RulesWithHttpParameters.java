package pl.put.poznan.rulework.model;

import org.rulelearn.rules.RuleSetWithComputableCharacteristics;
import pl.put.poznan.rulework.enums.RuleType;
import pl.put.poznan.rulework.enums.UnionType;

public class RulesWithHttpParameters {
    private RuleSetWithComputableCharacteristics ruleSet;
    private UnionType typeOfUnions;
    private Double consistencyThreshold;
    private RuleType typeOfRules;

    public RulesWithHttpParameters(RuleSetWithComputableCharacteristics rules) {
        this.ruleSet = rules;
    }

    public RulesWithHttpParameters(RuleSetWithComputableCharacteristics rules, UnionType typeOfUnions, Double consistencyThreshold, RuleType ruleType) {
        this.ruleSet = rules;
        this.typeOfUnions = typeOfUnions;
        this.consistencyThreshold = consistencyThreshold;
        this.typeOfRules = ruleType;
    }

    public RuleSetWithComputableCharacteristics getRuleSet() {
        return ruleSet;
    }

    public void setRuleSet(RuleSetWithComputableCharacteristics ruleSet) {
        this.ruleSet = ruleSet;
    }

    public UnionType getTypeOfUnions() {
        return typeOfUnions;
    }

    public void setTypeOfUnions(UnionType typeOfUnions) {
        this.typeOfUnions = typeOfUnions;
    }

    public Double getConsistencyThreshold() {
        return consistencyThreshold;
    }

    public void setConsistencyThreshold(Double consistencyThreshold) {
        this.consistencyThreshold = consistencyThreshold;
    }

    public RuleType getTypeOfRules() {
        return typeOfRules;
    }

    public void setTypeOfRules(RuleType typeOfRules) {
        this.typeOfRules = typeOfRules;
    }

    @Override
    public String toString() {
        return "RulesWithHttpParameters{" +
                "ruleSet=" + ruleSet +
                ", typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                ", typeOfRules=" + typeOfRules +
                '}';
    }
}
