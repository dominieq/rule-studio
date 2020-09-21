package pl.put.poznan.rulestudio.model.response;

import it.unimi.dsi.fastutil.ints.IntList;
import it.unimi.dsi.fastutil.ints.IntSet;
import org.rulelearn.rules.BasicRuleCoverageInformation;
import org.rulelearn.rules.RuleCharacteristics;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

import java.util.Arrays;

public class ChosenRuleResponse {

    private IntList indicesOfCoveredObjects;

    private Boolean[] isSupportingObject;

    private ChosenRuleResponse() {
        //private constructor
    }

    public IntList getIndicesOfCoveredObjects() {
        return indicesOfCoveredObjects;
    }

    public Boolean[] getIsSupportingObject() {
        return isSupportingObject;
    }

    @Override
    public String toString() {
        return "ChosenRuleResponse{" +
                "indicesOfCoveredObjects=" + indicesOfCoveredObjects +
                ", isSupportingObject=" + Arrays.toString(isSupportingObject) +
                '}';
    }

    public static class ChosenRuleResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ChosenRuleResponseBuilder.class);

        private IntList indicesOfCoveredObjects;
        private Boolean[] isSupportingObject;

        public static ChosenRuleResponseBuilder newInstance() {
            return new ChosenRuleResponseBuilder();
        }

        public ChosenRuleResponseBuilder setIndicesOfCoveredObjects(IntList indicesOfCoveredObjects) {
            this.indicesOfCoveredObjects = indicesOfCoveredObjects;
            return this;
        }

        public ChosenRuleResponseBuilder setIsSupportingObject(Boolean[] isSupportingObject) {
            this.isSupportingObject = isSupportingObject;
            return this;
        }

        public ChosenRuleResponse build() {
            ChosenRuleResponse chosenRuleResponse = new ChosenRuleResponse();

            chosenRuleResponse.indicesOfCoveredObjects = this.indicesOfCoveredObjects;
            chosenRuleResponse.isSupportingObject = this.isSupportingObject;

            return chosenRuleResponse;
        }

        public ChosenRuleResponse build(RuleSetWithCharacteristics ruleSetWithCharacteristics, Integer ruleIndex) {
            if((ruleIndex < 0) || (ruleIndex >= ruleSetWithCharacteristics.size())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given rule's index \"%d\" is incorrect. You can choose rule from %d to %d", ruleIndex, 0, ruleSetWithCharacteristics.size() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            ChosenRuleResponse chosenRuleResponse = new ChosenRuleResponse();

            final RuleCharacteristics ruleCharacteristics = ruleSetWithCharacteristics.getRuleCharacteristics(ruleIndex);
            final BasicRuleCoverageInformation basicRuleCoverageInformation = ruleCharacteristics.getRuleCoverageInformation();
            if(basicRuleCoverageInformation != null) {
                chosenRuleResponse.indicesOfCoveredObjects = basicRuleCoverageInformation.getIndicesOfCoveredObjects();

                final int numberOfCoveredObjects = chosenRuleResponse.indicesOfCoveredObjects.size();
                chosenRuleResponse.isSupportingObject = new Boolean[numberOfCoveredObjects];
                final IntSet indicesOfCoveredNotSupportingObjects = basicRuleCoverageInformation.getIndicesOfCoveredNotSupportingObjects();
                for(int i = 0; i < numberOfCoveredObjects; i++) {
                    if(indicesOfCoveredNotSupportingObjects.contains( chosenRuleResponse.indicesOfCoveredObjects.getInt(i) )) {
                        chosenRuleResponse.isSupportingObject[i] = false;
                    } else {
                        chosenRuleResponse.isSupportingObject[i] = true;
                    }
                }
            }

            return chosenRuleResponse;
        }
    }
}
