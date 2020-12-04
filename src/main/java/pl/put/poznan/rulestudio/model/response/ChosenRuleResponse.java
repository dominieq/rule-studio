package pl.put.poznan.rulestudio.model.response;

import it.unimi.dsi.fastutil.ints.IntSet;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.BasicRuleCoverageInformation;
import org.rulelearn.rules.RuleCharacteristics;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.DescriptiveAttributes;
import pl.put.poznan.rulestudio.model.RuLeStudioRule;
import pl.put.poznan.rulestudio.model.RuLeStudioRuleSet;

import java.util.Arrays;

public class ChosenRuleResponse {

    private String[] objectNames;

    private int[] indicesOfCoveredObjects;

    private Boolean[] isSupportingObject;

    private ChosenRuleResponse() {
        //private constructor
    }

    public String[] getObjectNames() {
        return objectNames;
    }

    public int[] getIndicesOfCoveredObjects() {
        return indicesOfCoveredObjects;
    }

    public Boolean[] getIsSupportingObject() {
        return isSupportingObject;
    }

    @Override
    public String toString() {
        return "ChosenRuleResponse{" +
                "objectNames=" + Arrays.toString(objectNames) +
                ", indicesOfCoveredObjects=" + Arrays.toString(indicesOfCoveredObjects) +
                ", isSupportingObject=" + Arrays.toString(isSupportingObject) +
                '}';
    }

    public static class ChosenRuleResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ChosenRuleResponseBuilder.class);

        private String[] objectNames;
        private int[] indicesOfCoveredObjects;
        private Boolean[] isSupportingObject;

        public static ChosenRuleResponseBuilder newInstance() {
            return new ChosenRuleResponseBuilder();
        }

        public ChosenRuleResponseBuilder setObjectNames(String[] objectNames) {
            this.objectNames = objectNames;
            return this;
        }

        public ChosenRuleResponseBuilder setIndicesOfCoveredObjects(int[] indicesOfCoveredObjects) {
            this.indicesOfCoveredObjects = indicesOfCoveredObjects;
            return this;
        }

        public ChosenRuleResponseBuilder setIsSupportingObject(Boolean[] isSupportingObject) {
            this.isSupportingObject = isSupportingObject;
            return this;
        }

        public ChosenRuleResponse build() {
            ChosenRuleResponse chosenRuleResponse = new ChosenRuleResponse();

            chosenRuleResponse.objectNames = this.objectNames;
            chosenRuleResponse.indicesOfCoveredObjects = this.indicesOfCoveredObjects;
            chosenRuleResponse.isSupportingObject = this.isSupportingObject;

            return chosenRuleResponse;
        }

        public ChosenRuleResponse build(RuleSetWithCharacteristics ruleSetWithCharacteristics, Integer ruleIndex, DescriptiveAttributes descriptiveAttributes, InformationTable informationTable) {
            if((ruleIndex < 0) || (ruleIndex >= ruleSetWithCharacteristics.size())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given rule's index \"%d\" is incorrect. You can choose rule from %d to %d", ruleIndex, 0, ruleSetWithCharacteristics.size() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            ChosenRuleResponse chosenRuleResponse = new ChosenRuleResponse();

            final RuleCharacteristics ruleCharacteristics = ruleSetWithCharacteristics.getRuleCharacteristics(ruleIndex);
            final BasicRuleCoverageInformation basicRuleCoverageInformation = ruleCharacteristics.getRuleCoverageInformation();
            if(basicRuleCoverageInformation != null) {
                chosenRuleResponse.indicesOfCoveredObjects = basicRuleCoverageInformation.getIndicesOfCoveredObjects().toIntArray();
                chosenRuleResponse.objectNames = descriptiveAttributes.extractChosenObjectNames(informationTable, chosenRuleResponse.indicesOfCoveredObjects);

                final int numberOfCoveredObjects = chosenRuleResponse.indicesOfCoveredObjects.length;
                chosenRuleResponse.isSupportingObject = new Boolean[numberOfCoveredObjects];
                final IntSet indicesOfCoveredNotSupportingObjects = basicRuleCoverageInformation.getIndicesOfCoveredNotSupportingObjects();
                for(int i = 0; i < numberOfCoveredObjects; i++) {
                    if(indicesOfCoveredNotSupportingObjects.contains( chosenRuleResponse.indicesOfCoveredObjects[i] )) {
                        chosenRuleResponse.isSupportingObject[i] = false;
                    } else {
                        chosenRuleResponse.isSupportingObject[i] = true;
                    }
                }
            }

            return chosenRuleResponse;
        }

        public ChosenRuleResponse build(RuLeStudioRuleSet ruLeStudioRuleSet, Integer ruleIndex, DescriptiveAttributes descriptiveAttributes, InformationTable informationTable) {
            final RuLeStudioRule[] rules = ruLeStudioRuleSet.getRuLeStudioRules();
            if((ruleIndex < 0) || (ruleIndex >= rules.length)) {
                WrongParameterException ex = new WrongParameterException(String.format("Given rule's index \"%d\" is incorrect. You can choose rule from %d to %d", ruleIndex, 0, rules.length - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            ChosenRuleResponse chosenRuleResponse = new ChosenRuleResponse();

            final RuLeStudioRule rule = rules[ruleIndex];
            chosenRuleResponse.indicesOfCoveredObjects = rule.getIndicesOfCoveredObjects();
            chosenRuleResponse.objectNames = descriptiveAttributes.extractChosenObjectNames(informationTable, chosenRuleResponse.indicesOfCoveredObjects);
            chosenRuleResponse.isSupportingObject = rule.getIsSupportingObject();

            return chosenRuleResponse;
        }
    }
}
