package pl.put.poznan.rulework.model;

import org.rulelearn.rules.RuleSetWithComputableCharacteristics;
import pl.put.poznan.rulework.enums.RuleType;
import pl.put.poznan.rulework.enums.UnionType;

public class RulesWithHttpParameters {
    private RuleSetWithComputableCharacteristics ruleSet;
    private UnionType typeOfUnion;
    private Double consistencyThreshold;
    private RuleType typeOfRule;

    public RulesWithHttpParameters(RuleSetWithComputableCharacteristics rules) {
        this.ruleSet = rules;
    }

    public RulesWithHttpParameters(RuleSetWithComputableCharacteristics rules, UnionType typeOfUnion, Double consistencyThreshold, RuleType ruleType) {
        this.ruleSet = rules;
        this.typeOfUnion = typeOfUnion;
        this.consistencyThreshold = consistencyThreshold;
        this.typeOfRule = ruleType;
    }

    public RuleSetWithComputableCharacteristics getRuleSet() {
        return ruleSet;
    }

    public void setRuleSet(RuleSetWithComputableCharacteristics ruleSet) {
        this.ruleSet = ruleSet;
    }

    public UnionType getTypeOfUnion() {
        return typeOfUnion;
    }

    public void setTypeOfUnion(UnionType typeOfUnion) {
        this.typeOfUnion = typeOfUnion;
    }

    public Double getConsistencyThreshold() {
        return consistencyThreshold;
    }

    public void setConsistencyThreshold(Double consistencyThreshold) {
        this.consistencyThreshold = consistencyThreshold;
    }

    public RuleType getTypeOfRule() {
        return typeOfRule;
    }

    public void setTypeOfRule(RuleType typeOfRule) {
        this.typeOfRule = typeOfRule;
    }

    @Override
    public String toString() {
        return "RulesWithHttpParameters{" +
                "ruleSet=" + ruleSet +
                ", typeOfUnion=" + typeOfUnion +
                ", consistencyThreshold=" + consistencyThreshold +
                ", typeOfRUle=" + typeOfRule +
                '}';
    }
}
