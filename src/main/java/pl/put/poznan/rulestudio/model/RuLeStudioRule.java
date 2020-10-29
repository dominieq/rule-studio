package pl.put.poznan.rulestudio.model;

import org.rulelearn.rules.Rule;
import org.rulelearn.rules.RuleCharacteristics;

import java.util.Arrays;

public class RuLeStudioRule {
    private Rule rule;
    private RuleCharacteristics ruleCharacteristics;
    private int[] indicesOfCoveredObjects;
    private Boolean[] isSupportingObject;

    public RuLeStudioRule(Rule rule, RuleCharacteristics ruleCharacteristics, int[] indicesOfCoveredObjects, Boolean[] isSupportingObject) {
        this.rule = rule;
        this.ruleCharacteristics = ruleCharacteristics;
        this.indicesOfCoveredObjects = indicesOfCoveredObjects;
        this.isSupportingObject = isSupportingObject;
    }

    public Rule getRule() {
        return rule;
    }

    public void setRule(Rule rule) {
        this.rule = rule;
    }

    public RuleCharacteristics getRuleCharacteristics() {
        return ruleCharacteristics;
    }

    public void setRuleCharacteristics(RuleCharacteristics ruleCharacteristics) {
        this.ruleCharacteristics = ruleCharacteristics;
    }

    public int[] getIndicesOfCoveredObjects() {
        return indicesOfCoveredObjects;
    }

    public void setIndicesOfCoveredObjects(int[] indicesOfCoveredObjects) {
        this.indicesOfCoveredObjects = indicesOfCoveredObjects;
    }

    public Boolean[] getIsSupportingObject() {
        return isSupportingObject;
    }

    public void setIsSupportingObject(Boolean[] isSupportingObject) {
        this.isSupportingObject = isSupportingObject;
    }

    @Override
    public String toString() {
        return "RuLeStudioRule{" +
                "rule=" + rule +
                ", ruleCharacteristics=" + ruleCharacteristics +
                ", indicesOfCoveredObjects=" + Arrays.toString(indicesOfCoveredObjects) +
                ", isSupportingObject=" + Arrays.toString(isSupportingObject) +
                '}';
    }
}
