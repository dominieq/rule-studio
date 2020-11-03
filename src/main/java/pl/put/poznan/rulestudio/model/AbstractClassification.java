package pl.put.poznan.rulestudio.model;

import it.unimi.dsi.fastutil.ints.IntArrayList;
import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.*;
import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.InformationTableWithDecisionDistributions;
import org.rulelearn.data.SimpleDecision;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.rulelearn.types.UnknownSimpleFieldMV2;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.exception.IncompatibleLearningInformationTableException;
import pl.put.poznan.rulestudio.exception.NoHashInRuleSetException;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.service.DataService;

import java.util.Arrays;
import java.util.List;

public abstract class AbstractClassification {
    protected final Logger logger = LoggerFactory.getLogger(getClass());

    private ClassificationResult[] classificationResults;
    private IntList[] indicesOfCoveringRules;
    private OrdinalMisclassificationMatrix ordinalMisclassificationMatrix;

    public ClassificationResult[] getClassificationResults() {
        return classificationResults;
    }

    public IntList[] getIndicesOfCoveringRules() {
        return indicesOfCoveringRules;
    }

    public OrdinalMisclassificationMatrix getOrdinalMisclassificationMatrix() {
        return ordinalMisclassificationMatrix;
    }

    @Override
    public String toString() {
        return "AbstractClassification{" +
                "classificationResults=" + Arrays.toString(classificationResults) +
                ", indicesOfCoveringRules=" + Arrays.toString(indicesOfCoveringRules) +
                ", ordinalMisclassificationMatrix=" + ordinalMisclassificationMatrix +
                '}';
    }

    protected SimpleEvaluatedClassificationResult createDefaultSimpleEvaluatedClassificationResult(DefaultClassificationResultType defaultClassificationResult, InformationTable informationTable) {
        InformationTableWithDecisionDistributions informationTableWithDecisionDistributions = DataService.createInformationTableWithDecisionDistributions(informationTable);
        SimpleEvaluatedClassificationResult simpleEvaluatedClassificationResult = null;
        SimpleDecision simpleDecision = null;

        switch (defaultClassificationResult) {
            case MAJORITY_DECISION_CLASS:
                List<Decision> modes = informationTableWithDecisionDistributions.getDecisionDistribution().getMode();

                if (modes != null) {
                    simpleDecision = (SimpleDecision)modes.get(0);
                } else {
                    simpleDecision = new SimpleDecision(new UnknownSimpleFieldMV2(), 0);
                }

                simpleEvaluatedClassificationResult = new SimpleEvaluatedClassificationResult(simpleDecision, 1.0);
                break;
            case MEDIAN_DECISION_CLASS:
                Decision median = informationTableWithDecisionDistributions.getDecisionDistribution().getMedian(informationTableWithDecisionDistributions.getOrderedUniqueFullyDeterminedDecisions());

                if (median != null) {
                    simpleDecision = (SimpleDecision)median;
                } else {
                    simpleDecision = new SimpleDecision(new UnknownSimpleFieldMV2(), 0);
                }

                simpleEvaluatedClassificationResult = new SimpleEvaluatedClassificationResult(simpleDecision, 1.0);
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given default classification result \"%s\" is unrecognized.", defaultClassificationResult));
                logger.error(ex.getMessage());
                break;
        }

        return simpleEvaluatedClassificationResult;
    }

    protected SimpleClassificationResult createDefaultSimpleClassificationResult(DefaultClassificationResultType defaultClassificationResult, InformationTable informationTable) {
        InformationTableWithDecisionDistributions informationTableWithDecisionDistributions = DataService.createInformationTableWithDecisionDistributions(informationTable);
        SimpleClassificationResult simpleClassificationResult = null;
        SimpleDecision simpleDecision = null;

        switch (defaultClassificationResult) {
            case MAJORITY_DECISION_CLASS:
                List<Decision> modes = informationTableWithDecisionDistributions.getDecisionDistribution().getMode();

                if (modes != null) {
                    simpleDecision = (SimpleDecision)modes.get(0);
                } else {
                    simpleDecision = new SimpleDecision(new UnknownSimpleFieldMV2(), 0);
                }

                simpleClassificationResult = new SimpleClassificationResult(simpleDecision);
                break;
            case MEDIAN_DECISION_CLASS:
                Decision median = informationTableWithDecisionDistributions.getDecisionDistribution().getMedian(informationTableWithDecisionDistributions.getOrderedUniqueFullyDeterminedDecisions());

                if (median != null) {
                    simpleDecision = (SimpleDecision)median;
                } else {
                    simpleDecision = new SimpleDecision(new UnknownSimpleFieldMV2(), 0);
                }

                simpleClassificationResult = new SimpleClassificationResult(simpleDecision);
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given default classification result \"%s\" is unrecognized.", defaultClassificationResult));
                logger.error(ex.getMessage());
                break;
        }

        return simpleClassificationResult;
    }

    protected void checkLearningInformationTableCompatibility(InformationTable learningInformationTable, RuleSetWithCharacteristics ruleSetWithCharacteristics) {
        String ruleSetHash = ruleSetWithCharacteristics.getLearningInformationTableHash();
        if(ruleSetHash == null) {
            NoHashInRuleSetException ex = new NoHashInRuleSetException(String.format("Provided rule set doesn't have learning information table hash. It can't be determined, if this rule set was generated based on given learning information table. Chosen classifier can't be used. Learning data hash: \"%s\".", learningInformationTable.getHash()));
            logger.error(ex.getMessage());
            throw ex;
        }

        if(!ruleSetHash.equals(learningInformationTable.getHash())) {
            IncompatibleLearningInformationTableException ex = new IncompatibleLearningInformationTableException(String.format("Data in the current project should be a valid training set for existing rules. Access to this set is required to apply chosen classifier. Please calculate new rules based on the current data or create a new project with a valid training set. Learning data hash: \"%s\", rules hash: \"%s\".", learningInformationTable.getHash(), ruleSetHash));
            logger.error(ex.getMessage());
            throw ex;
        }

        logger.info("Learning information table and rule set are compatible.");
    }

    protected void classify(InformationTable learningInformationTable, InformationTable classifiedInformationTable, ClassifierType typeOfClassifier, DefaultClassificationResultType typeOfDefaultClassificationResult, RuleSetWithCharacteristics ruleSetWithCharacteristics, Decision[] orderOfDecisions) {
        if(logger.isDebugEnabled()) {
            logger.debug("RuleSet size = {}", ruleSetWithCharacteristics.size());
            for(int i = 0; i < ruleSetWithCharacteristics.size(); i++) {
                logger.debug("\tRegula nr {}:\t{}", i, ruleSetWithCharacteristics.getRule(i));
            }
        }

        SimpleClassificationResult simpleClassificationResult = null;
        SimpleEvaluatedClassificationResult simpleEvaluatedClassificationResult = null;

        RuleClassifier classifier = null;

        switch (typeOfClassifier) {
            case SIMPLE_RULE_CLASSIFIER:
                simpleClassificationResult = createDefaultSimpleClassificationResult(typeOfDefaultClassificationResult, learningInformationTable);
                classifier = new SimpleRuleClassifier(ruleSetWithCharacteristics, simpleClassificationResult);
                break;
            case SIMPLE_OPTIMIZING_COUNTING_RULE_CLASSIFIER:
                simpleClassificationResult = createDefaultSimpleClassificationResult(typeOfDefaultClassificationResult, learningInformationTable);
                checkLearningInformationTableCompatibility(learningInformationTable, ruleSetWithCharacteristics);
                classifier = new SimpleOptimizingCountingRuleClassifier(ruleSetWithCharacteristics, simpleClassificationResult, learningInformationTable);
                break;
            case SCORING_RULE_CLASSIFIER_SCORE:
                simpleEvaluatedClassificationResult = createDefaultSimpleEvaluatedClassificationResult(typeOfDefaultClassificationResult, learningInformationTable);
                checkLearningInformationTableCompatibility(learningInformationTable, ruleSetWithCharacteristics);
                classifier = new ScoringRuleClassifier(ruleSetWithCharacteristics, simpleEvaluatedClassificationResult, ScoringRuleClassifier.Mode.SCORE, learningInformationTable);
                break;
            case SCORING_RULE_CLASSIFIER_HYBRID:
                simpleEvaluatedClassificationResult = createDefaultSimpleEvaluatedClassificationResult(typeOfDefaultClassificationResult, learningInformationTable);
                checkLearningInformationTableCompatibility(learningInformationTable, ruleSetWithCharacteristics);
                classifier = new ScoringRuleClassifier(ruleSetWithCharacteristics, simpleEvaluatedClassificationResult, ScoringRuleClassifier.Mode.HYBRID, learningInformationTable);
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of classifier \"%s\" is unrecognized.", typeOfClassifier));
                logger.error(ex.getMessage());
                throw ex;
        }

        int objectIndex;
        int objectCount = classifiedInformationTable.getNumberOfObjects();
        indicesOfCoveringRules = new IntList[objectCount];

        classificationResults = new ClassificationResult[objectCount];
        for (objectIndex = 0; objectIndex < classificationResults.length; objectIndex++) {
            indicesOfCoveringRules[objectIndex] = new IntArrayList();
            classificationResults[objectIndex] = classifier.classify(objectIndex, classifiedInformationTable, indicesOfCoveringRules[objectIndex]);
        }

        if(logger.isDebugEnabled()) {
            for(objectIndex = 0; objectIndex < objectCount; objectIndex++) {
                logger.debug("Obiekt nr {}:\t{}", objectIndex, classifiedInformationTable.getFields(objectIndex).toString());
                for(int ruleIndex = 0; ruleIndex < indicesOfCoveringRules[objectIndex].size(); ruleIndex++) {
                    logger.debug("\tRegula nr {}:\t{}", ruleIndex, ruleSetWithCharacteristics.getRule(indicesOfCoveringRules[objectIndex].getInt(ruleIndex)));
                }
            }
        }

        Decision[] suggestedDecisions = new Decision[classificationResults.length];
        for(int i = 0; i < classificationResults.length; i++) {
            suggestedDecisions[i] = classificationResults[i].getSuggestedDecision();
        }
        ordinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(orderOfDecisions, classifiedInformationTable.getDecisions(), suggestedDecisions);
    }
}
