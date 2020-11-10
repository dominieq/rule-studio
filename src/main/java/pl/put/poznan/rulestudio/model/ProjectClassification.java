package pl.put.poznan.rulestudio.model;

import org.rulelearn.core.TernaryLogicValue;
import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.SimpleDecision;
import org.rulelearn.rules.Rule;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.rulelearn.types.EvaluationField;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ProjectClassification extends AbstractClassification {
    private InformationTable classifiedInformationTable;
    private Decision[] orderOfDecisions;
    private ClassifierType classifierType;
    private DefaultClassificationResultType defaultClassificationResultType;
    private boolean externalData;
    private String externalDataFileName;
    private String learningDataHash;
    private Boolean isCurrentLearningData;
    private String ruleSetHash;
    private Boolean isCurrentRuleSet;
    private DescriptiveAttributes descriptiveAttributes;
    private DescriptiveAttributes rulesDescriptiveAttributes;

    public ProjectClassification(InformationTable learningInformationTable, InformationTable classifiedInformationTable, DescriptiveAttributes projectDescriptiveAttributes, ClassifierType classifierType, DefaultClassificationResultType defaultClassificationResultType, RuleSetWithCharacteristics ruleSetWithCharacteristics) {
        this(learningInformationTable, classifiedInformationTable, projectDescriptiveAttributes, classifierType, defaultClassificationResultType, ruleSetWithCharacteristics, null);
    }

    public ProjectClassification(InformationTable learningInformationTable, InformationTable classifiedInformationTable, DescriptiveAttributes projectDescriptiveAttributes, ClassifierType classifierType, DefaultClassificationResultType defaultClassificationResultType, RuleSetWithCharacteristics ruleSetWithCharacteristics, String externalDataFileName) {
        orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithCharacteristics, classifiedInformationTable);
        classify(learningInformationTable, classifiedInformationTable, classifierType, defaultClassificationResultType, ruleSetWithCharacteristics, orderOfDecisions);

        this.classifiedInformationTable = classifiedInformationTable;
        this.classifierType = classifierType;
        this.defaultClassificationResultType = defaultClassificationResultType;

        if(externalDataFileName != null) {
            this.externalData = true;
            this.externalDataFileName = externalDataFileName;
        } else {
            this.externalData = false;
            this.externalDataFileName = null;
        }

        learningDataHash = learningInformationTable.getHash();
        isCurrentLearningData = true;
        ruleSetHash = ruleSetWithCharacteristics.getHash();
        isCurrentRuleSet = true;

        descriptiveAttributes = new DescriptiveAttributes(projectDescriptiveAttributes);
        rulesDescriptiveAttributes = new DescriptiveAttributes(projectDescriptiveAttributes);   //@todo: change 'learningInformationTable' to original learning data of rules
    }

    public InformationTable getClassifiedInformationTable() {
        return classifiedInformationTable;
    }

    public Decision[] getOrderOfDecisions() {
        return orderOfDecisions;
    }

    public ClassifierType getClassifierType() {
        return classifierType;
    }

    public DefaultClassificationResultType getDefaultClassificationResultType() {
        return defaultClassificationResultType;
    }

    public boolean isExternalData() {
        return externalData;
    }

    public String getExternalDataFileName() {
        return externalDataFileName;
    }

    public String getLearningDataHash() {
        return learningDataHash;
    }

    public Boolean isCurrentLearningData() {
        return isCurrentLearningData;
    }

    public void setCurrentLearningData(Boolean currentLearningData) {
        isCurrentLearningData = currentLearningData;
    }

    public String getRuleSetHash() {
        return ruleSetHash;
    }

    public Boolean isCurrentRuleSet() {
        return isCurrentRuleSet;
    }

    public void setCurrentRuleSet(Boolean currentRuleSet) {
        isCurrentRuleSet = currentRuleSet;
    }

    public DescriptiveAttributes getDescriptiveAttributes() {
        return descriptiveAttributes;
    }

    public DescriptiveAttributes getRulesDescriptiveAttributes() {
        return rulesDescriptiveAttributes;
    }

    @Override
    public String toString() {
        return "ProjectClassification{" +
                "classifiedInformationTable=" + classifiedInformationTable +
                ", orderOfDecisions=" + Arrays.toString(orderOfDecisions) +
                ", classifierType=" + classifierType +
                ", defaultClassificationResultType=" + defaultClassificationResultType +
                ", externalData=" + externalData +
                ", externalDataFileName='" + externalDataFileName + '\'' +
                ", learningDataHash='" + learningDataHash + '\'' +
                ", isCurrentLearningData=" + isCurrentLearningData +
                ", ruleSetHash='" + ruleSetHash + '\'' +
                ", isCurrentRuleSet=" + isCurrentRuleSet +
                ", descriptiveAttributes=" + descriptiveAttributes +
                ", rulesDescriptiveAttributes=" + rulesDescriptiveAttributes +
                "} " + super.toString();
    }

    private static Decision[] induceOrderedUniqueFullyDeterminedDecisions(RuleSetWithCharacteristics ruleSetWithCharacteristics, InformationTable informationTable) {
        List<Decision> allDecisions = new ArrayList<>();

        Decision[] informationTableDecisions = informationTable.getOrderedUniqueFullyDeterminedDecisions();
        if(informationTableDecisions != null) {
            for(int i = 0; i < informationTableDecisions.length; i++) {
                allDecisions.add(informationTableDecisions[i]);
            }
        }

        for(int i = 0; i < ruleSetWithCharacteristics.size(); i++) {
            Rule rule = ruleSetWithCharacteristics.getRule(i);
            allDecisions.add(new SimpleDecision(rule.getDecision().getLimitingEvaluation(), rule.getDecision().getAttributeWithContext().getAttributeIndex()));
        }


        if (allDecisions.size() < 1) {
            return allDecisions.toArray(new Decision[0]);
        }

        ArrayList<Decision> orderedUniqueFullyDeterminedDecisionsList = new ArrayList<Decision>();

        //Similar generating ordered unique fully determined array of decisions, but comparison of decision is done with accuracy to evaluation field (without attribute index)
        //auxiliary variables
        Decision candidateDecision;
        Decision alreadyPresentDecision;
        boolean iterate;
        int decisionIndex;
        EvaluationField candidateDecisionEvaluationField;
        EvaluationField alreadyPresentDecisionEvaluationField;

        //create sorted list of decisions:

        //extract first fully-determined decision (if there is any)
        int startingIndex = allDecisions.size(); //make sure that if there is no fully-determined decision, so first such decision could not be found, then next such decisions would not be searched for
        for (int i = 0; i < allDecisions.size(); i++) {
            //current decision is fully-determined
            if (allDecisions.get(i).hasNoMissingEvaluation()) {
                orderedUniqueFullyDeterminedDecisionsList.add(allDecisions.get(i));
                startingIndex = i + 1;
                break; //first fully-determined decision found
            }
        }

        //iterate through objects and extract next unique fully-determined decisions, retaining respective order of comparable decisions
        for (int i = startingIndex; i < allDecisions.size(); i++) {
            candidateDecision = allDecisions.get(i);

            //verify if candidate decision satisfies loop entry condition of being fully-determined
            if (candidateDecision.hasNoMissingEvaluation()) {
                iterate = true;
                decisionIndex = 0;

                while (iterate) {
                    alreadyPresentDecision = orderedUniqueFullyDeterminedDecisionsList.get(decisionIndex);
                    candidateDecisionEvaluationField = candidateDecision.getEvaluation(candidateDecision.getAttributeIndices().iterator().nextInt());
                    alreadyPresentDecisionEvaluationField = alreadyPresentDecision.getEvaluation(alreadyPresentDecision.getAttributeIndices().iterator().nextInt());
                    //candidate decision has identical evaluation field to compared decision from the list
                    if (candidateDecisionEvaluationField.equals(alreadyPresentDecisionEvaluationField)) {
                        //ignore candidate decision since it is already present in the list of decisions
                        iterate = false;
                    }
                    //candidate decision is different than compared decision from the list
                    else {
                        //candidate decision is worse than compared decision from the list
                        if (candidateDecision.isAtMostAsGoodAs(alreadyPresentDecision) == TernaryLogicValue.TRUE) {
                            //insert candidate decision into appropriate position and shift following elements forward
                            orderedUniqueFullyDeterminedDecisionsList.add(decisionIndex, candidateDecision);
                            iterate = false;
                        }
                        //candidate decision is better than compared decision from the list
                        //or is incomparable with the compared decision from the list
                        else {
                            //there is no next decision on the list
                            if (decisionIndex == orderedUniqueFullyDeterminedDecisionsList.size() - 1) {
                                //append candidate decision to the end of the list
                                orderedUniqueFullyDeterminedDecisionsList.add(candidateDecision);
                                iterate = false;
                            }
                            //there is next decision on the list
                            else {
                                decisionIndex++; //go to next decision from the list
                            } //else
                        } //else
                    } //else
                } //while
            } //if
        } //for

        //create returned array of decisions
        int decisionsCount = orderedUniqueFullyDeterminedDecisionsList.size();
        Decision[] orderedUniqueFullyDeterminedDecisions = new Decision[decisionsCount];

        for (int i = 0; i < decisionsCount; i++)
            orderedUniqueFullyDeterminedDecisions[i] = orderedUniqueFullyDeterminedDecisionsList.get(i);

        return orderedUniqueFullyDeterminedDecisions;
    }
}
