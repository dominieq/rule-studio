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
    private DescriptiveAttributes classifiedDescriptiveAttributes;
    private Decision[] orderOfDecisions;
    private ClassifierType classifierType;
    private DefaultClassificationResultType defaultClassificationResultType;
    private String projectDataHash;
    private Boolean isCurrentProjectData;
    private String attributesHash;
    private boolean externalData;
    private String externalDataFileName;
    private RuleSetWithCharacteristics ruleSet;
    private Boolean isCurrentRuleSet;
    private Boolean isOriginalLearningData;
    private InformationTable learningInformationTable;
    private DescriptiveAttributes learningDescriptiveAttributes;
    private Boolean isCurrentLearningData;
    private String calculationsTime;

    public ProjectClassification(ProjectRules projectRules, InformationTable classifiedInformationTable, ClassifierType classifierType, DefaultClassificationResultType defaultClassificationResultType, String[] classifiedDescriptiveAttributesPriority, String[] learningDescriptiveAttributesPriority, InformationTable projectDataInformationTable) {
        this(projectRules, classifiedInformationTable, classifierType, defaultClassificationResultType, classifiedDescriptiveAttributesPriority, learningDescriptiveAttributesPriority, projectDataInformationTable, null);
    }

    public ProjectClassification(ProjectRules projectRules, InformationTable classifiedInformationTable, ClassifierType classifierType, DefaultClassificationResultType defaultClassificationResultType, String[] classifiedDescriptiveAttributesPriority, String[] learningDescriptiveAttributesPriority, InformationTable projectDataInformationTable, String externalDataFileName) {
        CalculationsStopWatch calculationsStopWatch = new CalculationsStopWatch();

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = projectRules.getRuleSet();
        if(projectRules.isCoveragePresent()) {
            this.isOriginalLearningData = true;
            this.learningInformationTable = projectRules.getInformationTable();
            this.isCurrentLearningData = projectRules.isCurrentLearningData();
        } else {
            this.isOriginalLearningData = false;
            this.learningInformationTable = projectDataInformationTable;
            this.isCurrentLearningData = true;
        }
        this.learningDescriptiveAttributes = new DescriptiveAttributes(this.learningInformationTable, learningDescriptiveAttributesPriority);


        orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithCharacteristics, classifiedInformationTable);
        classify(this.learningInformationTable, classifiedInformationTable, classifierType, defaultClassificationResultType, ruleSetWithCharacteristics, orderOfDecisions);

        this.classifiedInformationTable = classifiedInformationTable;
        this.classifiedDescriptiveAttributes = new DescriptiveAttributes(classifiedInformationTable, classifiedDescriptiveAttributesPriority);
        this.classifierType = classifierType;
        this.defaultClassificationResultType = defaultClassificationResultType;

        this.projectDataHash = projectDataInformationTable.getHash();
        this.isCurrentProjectData = true;

        if(externalDataFileName != null) {
            this.externalData = true;
            this.externalDataFileName = externalDataFileName;
            this.attributesHash = new InformationTable(classifiedInformationTable.getAttributes(), new ArrayList<>()).getHash();
        } else {
            this.externalData = false;
            this.externalDataFileName = null;
            this.attributesHash = null;
        }

        this.ruleSet = ruleSetWithCharacteristics;
        this.isCurrentRuleSet = true;

        calculationsStopWatch.stop();
        this.calculationsTime = calculationsStopWatch.getReadableTime();
    }

    public InformationTable getClassifiedInformationTable() {
        return classifiedInformationTable;
    }

    public DescriptiveAttributes getClassifiedDescriptiveAttributes() {
        return classifiedDescriptiveAttributes;
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

    public String getProjectDataHash() {
        return projectDataHash;
    }

    public Boolean isCurrentProjectData() {
        return isCurrentProjectData;
    }

    public void setCurrentProjectData(Boolean currentProjectData) {
        isCurrentProjectData = currentProjectData;
    }

    public String getAttributesHash() {
        return attributesHash;
    }

    public void setAttributesHash(String attributesHash) {
        this.attributesHash = attributesHash;
    }

    public boolean isExternalData() {
        return externalData;
    }

    public String getExternalDataFileName() {
        return externalDataFileName;
    }

    public RuleSetWithCharacteristics getRuleSet() {
        return ruleSet;
    }

    public Boolean isCurrentRuleSet() {
        return isCurrentRuleSet;
    }

    public void setCurrentRuleSet(Boolean currentRuleSet) {
        isCurrentRuleSet = currentRuleSet;
    }

    public Boolean isOriginalLearningData() {
        return isOriginalLearningData;
    }

    public void setOriginalLearningData(Boolean originalLearningData) {
        isOriginalLearningData = originalLearningData;
    }

    public InformationTable getLearningInformationTable() {
        return learningInformationTable;
    }

    public DescriptiveAttributes getLearningDescriptiveAttributes() {
        return learningDescriptiveAttributes;
    }

    public Boolean isCurrentLearningData() {
        return isCurrentLearningData;
    }

    public void setCurrentLearningData(Boolean currentLearningData) {
        isCurrentLearningData = currentLearningData;
    }

    public String getCalculationsTime() {
        return calculationsTime;
    }

    @Override
    public String toString() {
        return "ProjectClassification{" +
                "classifiedInformationTable=" + classifiedInformationTable +
                ", classifiedDescriptiveAttributes=" + classifiedDescriptiveAttributes +
                ", orderOfDecisions=" + Arrays.toString(orderOfDecisions) +
                ", classifierType=" + classifierType +
                ", defaultClassificationResultType=" + defaultClassificationResultType +
                ", projectDataHash='" + projectDataHash + '\'' +
                ", isCurrentProjectData=" + isCurrentProjectData +
                ", attributesHash='" + attributesHash + '\'' +
                ", externalData=" + externalData +
                ", externalDataFileName='" + externalDataFileName + '\'' +
                ", ruleSet=" + ruleSet +
                ", isCurrentRuleSet=" + isCurrentRuleSet +
                ", isOriginalLearningData=" + isOriginalLearningData +
                ", learningInformationTable=" + learningInformationTable +
                ", learningDescriptiveAttributes=" + learningDescriptiveAttributes +
                ", isCurrentLearningData=" + isCurrentLearningData +
                ", calculationsTime='" + calculationsTime + '\'' +
                "} " + super.toString();
    }

    private Decision[] induceOrderedUniqueFullyDeterminedDecisions(RuleSetWithCharacteristics ruleSetWithCharacteristics, InformationTable informationTable) {
        List<Decision> allDecisions = new ArrayList<>();

        Decision[] informationTableDecisions = informationTable.getOrderedUniqueFullyDeterminedDecisions();
        if(informationTableDecisions != null) {
            for(int i = 0; i < informationTableDecisions.length; i++) {
                allDecisions.add(informationTableDecisions[i]);
                logger.debug(String.format("%d:\tObject's decision:\t%s", i, allDecisions.get(allDecisions.size() - 1).toString()));
            }
        }

        for(int i = 0; i < ruleSetWithCharacteristics.size(); i++) {
            Rule rule = ruleSetWithCharacteristics.getRule(i);
            allDecisions.add(new SimpleDecision(rule.getDecision().getLimitingEvaluation(), rule.getDecision().getAttributeWithContext().getAttributeIndex()));
            logger.debug(String.format("%d:\tRule's decision:\t%s", informationTableDecisions.length + i, allDecisions.get(i).toString()));
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

        logger.debug(String.format("First decision:\t%d %s", startingIndex - 1, orderedUniqueFullyDeterminedDecisionsList.get(0).toString()));
        //iterate through objects and extract next unique fully-determined decisions, retaining respective order of comparable decisions
        for (int i = startingIndex; i < allDecisions.size(); i++) {
            candidateDecision = allDecisions.get(i);
            logger.debug(String.format("%d\tcandidate %s", i, candidateDecision.toString()));

            //verify if candidate decision satisfies loop entry condition of being fully-determined
            if (candidateDecision.hasNoMissingEvaluation()) {
                iterate = true;
                decisionIndex = 0;

                while (iterate) {
                    alreadyPresentDecision = orderedUniqueFullyDeterminedDecisionsList.get(decisionIndex);
                    candidateDecisionEvaluationField = candidateDecision.getEvaluation(candidateDecision.getAttributeIndices().iterator().nextInt());
                    alreadyPresentDecisionEvaluationField = alreadyPresentDecision.getEvaluation(alreadyPresentDecision.getAttributeIndices().iterator().nextInt());
                    //candidate decision has identical evaluation field to compared decision from the list
                    //if (candidateDecision.equals(alreadyPresentDecision)) {
                    //if (candidateDecision == alreadyPresentDecision) {
                    if (candidateDecisionEvaluationField.equals(alreadyPresentDecisionEvaluationField)) {
                        //ignore candidate decision since it is already present in the list of decisions
                        iterate = false;
                        logger.debug(String.format("%d\trejected", i));
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

    public String[] interpretFlags() {
        if ((this.isCurrentProjectData())
                && (this.isCurrentRuleSet() != null) && (this.isCurrentRuleSet())
                && (this.isOriginalLearningData())
                && (this.isCurrentLearningData())) {
            return null;
        } else {
            ArrayList<String> errorMessages = new ArrayList<>();

            if (!this.isCurrentProjectData()) {
                if (this.isExternalData()) {
                    errorMessages.add("The classified objects have been uploaded with different attributes than current attributes in the DATA tab.");
                } else {
                    errorMessages.add("The classified objects are different from the objects in the DATA tab.");
                }
            }

            if (this.isCurrentRuleSet() == null) {
                errorMessages.add("The rule set used in classification is different from the current rule set in the RULES tab; no rule set in the RULES tab.");
            } else if (!this.isCurrentRuleSet()) {
                errorMessages.add("The rule set used in classification is different from the current rule set in the RULES tab.");
            }

            if (!this.isOriginalLearningData()) {
                errorMessages.add("The rule set used in classification didn't have access to learning data. The objects from the DATA tab were used as learning data.");
            }

            if (!this.isCurrentLearningData()) {
                if (this.isOriginalLearningData()) {
                    errorMessages.add("The learning data is different from current data in the DATA tab.");
                } else {
                    errorMessages.add("The data used in classification as a learning data for rules is not the same as the current data in the DATA tab.");
                }
            }

            return errorMessages.toArray(new String[0]);
        }
    }
}
