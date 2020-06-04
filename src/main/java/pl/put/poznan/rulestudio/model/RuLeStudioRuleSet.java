package pl.put.poznan.rulestudio.model;

import it.unimi.dsi.fastutil.ints.IntSet;
import org.rulelearn.rules.BasicRuleCoverageInformation;
import org.rulelearn.rules.Rule;
import org.rulelearn.rules.RuleCharacteristics;
import org.rulelearn.rules.RuleSetWithCharacteristics;

import java.util.Arrays;

public class RuLeStudioRuleSet {
    private RuLeStudioRule[] ruLeStudioRules;

    public RuLeStudioRuleSet(RuleSetWithCharacteristics ruleSetWithCharacteristics) {
        ruLeStudioRules = new RuLeStudioRule[ruleSetWithCharacteristics.size()];

        for(int i = 0; i < ruleSetWithCharacteristics.size(); i++) {
            Rule rule = ruleSetWithCharacteristics.getRule(i);
            RuleCharacteristics ruleCharacteristics = ruleSetWithCharacteristics.getRuleCharacteristics(i);
            Integer[] indicesOfCoveredObjects = null;
            Boolean[] isSupportingObjectArray = null;

            BasicRuleCoverageInformation basicRuleCoverageInformation = ruleCharacteristics.getRuleCoverageInformation();
            if(basicRuleCoverageInformation != null) {
                indicesOfCoveredObjects = basicRuleCoverageInformation.getIndicesOfCoveredObjects().toArray(new Integer[0]);
                IntSet indicesOfCoveredNotSupportingObjects = basicRuleCoverageInformation.getIndicesOfCoveredNotSupportingObjects();

                int numberOfCoveredObjects = indicesOfCoveredObjects.length;
                isSupportingObjectArray = new Boolean[numberOfCoveredObjects];
                for(int j = 0; j < numberOfCoveredObjects; j++) {
                    if(indicesOfCoveredNotSupportingObjects.contains( indicesOfCoveredObjects[j].intValue() )) {
                        isSupportingObjectArray[j] = false;
                    } else {
                        isSupportingObjectArray[j] = true;
                    }
                }
            }

            ruLeStudioRules[i] = new RuLeStudioRule(rule, ruleCharacteristics, indicesOfCoveredObjects, isSupportingObjectArray);
        }
    }

    public RuLeStudioRule[] getRuLeStudioRules() {
        return ruLeStudioRules;
    }

    public void setRuLeStudioRules(RuLeStudioRule[] ruLeStudioRules) {
        this.ruLeStudioRules = ruLeStudioRules;
    }

    @Override
    public String toString() {
        return "RuLeStudioRuleSet{" +
                "ruLeStudioRules=" + Arrays.toString(ruLeStudioRules) +
                '}';
    }
}
