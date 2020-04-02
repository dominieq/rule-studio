package pl.put.poznan.rulework.service;

import it.unimi.dsi.fastutil.ints.IntArrayList;
import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.*;
import org.rulelearn.core.TernaryLogicValue;
import org.rulelearn.data.*;
import org.rulelearn.rules.Rule;
import org.rulelearn.rules.RuleSetWithComputableCharacteristics;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.enums.ClassifierType;
import pl.put.poznan.rulework.enums.DefaultClassificationResultType;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.exception.WrongParameterException;
import pl.put.poznan.rulework.model.Classification;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ClassificationService {

    private static final Logger logger = LoggerFactory.getLogger(ClassificationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private static Decision[] induceOrderedUniqueFullyDeterminedDecisions(RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics, InformationTable informationTable) {
        List<Decision> allDecisions = new ArrayList<>();

        Decision[] informationTableDecisions = informationTable.getOrderedUniqueFullyDeterminedDecisions();
        for(int i = 0; i < informationTableDecisions.length; i++) {
            allDecisions.add(informationTableDecisions[i]);
        }

        for(int i = 0; i < ruleSetWithComputableCharacteristics.size(); i++) {
            Rule rule = ruleSetWithComputableCharacteristics.getRule(i);
            rule.getDecision();
            allDecisions.add(new SimpleDecision(rule.getDecision().getLimitingEvaluation(), rule.getDecision().getAttributeWithContext().getAttributeIndex()));
        }


        if (allDecisions.size() < 1) {
            return allDecisions.toArray(new Decision[0]);
        }

        ArrayList<Decision> orderedUniqueFullyDeterminedDecisionsList = new ArrayList<Decision>();

        //auxiliary variables
        Decision candidateDecision;
        Decision alreadyPresentDecision;
        boolean iterate;
        int decisionIndex;

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
                    //candidate decision is equal (identical) to compared decision from the list
                    if (candidateDecision.equals(alreadyPresentDecision)) {
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

    private static SimpleEvaluatedClassificationResult createDefaultSimpleEvaluatedClassificationResult(DefaultClassificationResultType defaultClassificationResult, InformationTable informationTable) {
        InformationTableWithDecisionDistributions informationTableWithDecisionDistributions = new InformationTableWithDecisionDistributions(informationTable);
        SimpleEvaluatedClassificationResult simpleEvaluatedClassificationResult = null;

        switch (defaultClassificationResult) {
            case MAJORITY_DECISION_CLASS:
                List<Decision> modes = informationTableWithDecisionDistributions.getDecisionDistribution().getMode();
                simpleEvaluatedClassificationResult = new SimpleEvaluatedClassificationResult((SimpleDecision)modes.get(0), 1.0);
                break;
            case MEDIAN_DECISION_CLASS:
                Decision median = informationTableWithDecisionDistributions.getDecisionDistribution().getMedian(informationTableWithDecisionDistributions.getOrderedUniqueFullyDeterminedDecisions());
                simpleEvaluatedClassificationResult = new SimpleEvaluatedClassificationResult((SimpleDecision)median, 1.0);
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given default classification result \"%s\" is unrecognized.", defaultClassificationResult));
                logger.error(ex.getMessage());
                break;
        }

        return simpleEvaluatedClassificationResult;
    }

    private static SimpleClassificationResult createDefaultSimpleClassificationResult(DefaultClassificationResultType defaultClassificationResult, InformationTable informationTable) {
        InformationTableWithDecisionDistributions informationTableWithDecisionDistributions = new InformationTableWithDecisionDistributions(informationTable);
        SimpleClassificationResult simpleClassificationResult = null;

        switch (defaultClassificationResult) {
            case MAJORITY_DECISION_CLASS:
                List<Decision> modes = informationTableWithDecisionDistributions.getDecisionDistribution().getMode();
                simpleClassificationResult = new SimpleClassificationResult((SimpleDecision)modes.get(0));
                break;
            case MEDIAN_DECISION_CLASS:
                Decision median = informationTableWithDecisionDistributions.getDecisionDistribution().getMedian(informationTableWithDecisionDistributions.getOrderedUniqueFullyDeterminedDecisions());
                simpleClassificationResult = new SimpleClassificationResult((SimpleDecision)median);
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given default classification result \"%s\" is unrecognized.", defaultClassificationResult));
                logger.error(ex.getMessage());
                break;
        }

        return simpleClassificationResult;
    }

    public static Classification calculateClassification(InformationTable informationTable, ClassifierType typeOfClassifier, DefaultClassificationResultType typeOfDefaultClassificationResult, RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics, Decision[] orderOfDecisions) {
        if(logger.isDebugEnabled()) {
            logger.debug("RuleSet size = {}", ruleSetWithComputableCharacteristics.size());
            for(int i = 0; i < ruleSetWithComputableCharacteristics.size(); i++) {
                logger.debug("\tRegula nr {}:\t{}", i, ruleSetWithComputableCharacteristics.getRule(i));
            }
        }

        SimpleClassificationResult simpleClassificationResult = null;
        SimpleEvaluatedClassificationResult simpleEvaluatedClassificationResult = null;

        RuleClassifier classifier = null;

        switch (typeOfClassifier) {
            case SIMPLE_RULE_CLASSIFIER:
                simpleClassificationResult = createDefaultSimpleClassificationResult(typeOfDefaultClassificationResult, informationTable);
                classifier = new SimpleRuleClassifier(ruleSetWithComputableCharacteristics, simpleClassificationResult);
                break;
            case SIMPLE_OPTIMIZING_COUNTING_RULE_CLASSIFIER:
                simpleClassificationResult = createDefaultSimpleClassificationResult(typeOfDefaultClassificationResult, informationTable);
                classifier = new SimpleOptimizingCountingRuleClassifier(ruleSetWithComputableCharacteristics, simpleClassificationResult);
                break;
            case SCORING_RULE_CLASSIFIER_SCORE:
                simpleEvaluatedClassificationResult = createDefaultSimpleEvaluatedClassificationResult(typeOfDefaultClassificationResult, informationTable);
                classifier = new ScoringRuleClassifier(ruleSetWithComputableCharacteristics, simpleEvaluatedClassificationResult, ScoringRuleClassifier.Mode.SCORE);
                break;
            case SCORING_RULE_CLASSIFIER_HYBRID:
                simpleEvaluatedClassificationResult = createDefaultSimpleEvaluatedClassificationResult(typeOfDefaultClassificationResult, informationTable);
                classifier = new ScoringRuleClassifier(ruleSetWithComputableCharacteristics, simpleEvaluatedClassificationResult, ScoringRuleClassifier.Mode.HYBRID);
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of classifier \"%s\" is unrecognized.", typeOfClassifier));
                logger.error(ex.getMessage());
                throw ex;
        }

        int objectIndex;
        int objectCount = informationTable.getNumberOfObjects();
        IntList[] indicesOfCoveringRules = new IntList[objectCount];

        ClassificationResult[] classificationResults = new ClassificationResult[objectCount];
        for (objectIndex = 0; objectIndex < classificationResults.length; objectIndex++) {
            indicesOfCoveringRules[objectIndex] = new IntArrayList();
            classificationResults[objectIndex] = classifier.classify(objectIndex, informationTable, indicesOfCoveringRules[objectIndex]);
        }

        if(logger.isDebugEnabled()) {
            for(objectIndex = 0; objectIndex < objectCount; objectIndex++) {
                logger.debug("Obiekt nr {}:\t{}", objectIndex, informationTable.getFields(objectIndex).toString());
                for(int ruleIndex = 0; ruleIndex < indicesOfCoveringRules[objectIndex].size(); ruleIndex++) {
                    logger.debug("\tRegula nr {}:\t{}", ruleIndex, ruleSetWithComputableCharacteristics.getRule(indicesOfCoveringRules[objectIndex].getInt(ruleIndex)));
                }
            }
        }

        Decision[] suggestedDecisions = new Decision[classificationResults.length];
        for(int i = 0; i < classificationResults.length; i++) {
            suggestedDecisions[i] = classificationResults[i].getSuggestedDecision();
        }
        OrdinalMisclassificationMatrix ordinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(orderOfDecisions, informationTable.getDecisions(), suggestedDecisions);

        Classification classification = new Classification(classificationResults, informationTable, orderOfDecisions, indicesOfCoveringRules, ordinalMisclassificationMatrix, typeOfClassifier, typeOfDefaultClassificationResult);
        return classification;
    }

    public Classification getClassification(UUID id) {
        logger.info("Id;\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        Classification classification = project.getClassification();
        if(classification == null) {
            EmptyResponseException ex = new EmptyResponseException("Classification", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        logger.debug("classification:\t{}", classification);
        return classification;
    }

    public Classification putClassification(UUID id, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);
        InformationTable informationTable = project.getInformationTable();

        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = project.getRules().getRuleSet();
        if(ruleSetWithComputableCharacteristics == null) {
            EmptyResponseException ex = new EmptyResponseException("Rules", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        Decision[] orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithComputableCharacteristics, informationTable);
        Classification classification = calculateClassification(informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithComputableCharacteristics, orderOfDecisions);
        project.setClassification(classification);

        return classification;
    }

    public Classification putClassificationNewData(
            UUID id,
            ClassifierType typeOfClassifier,
            DefaultClassificationResultType defaultClassificationResult,
            MultipartFile dataFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("Data:\t{}\t{}", dataFile.getOriginalFilename(), dataFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        Attribute[] attributes = project.getInformationTable().getAttributes();
        InformationTable informationTable = DataService.informationTableFromMultipartFileData(dataFile, attributes, separator, header);

        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = project.getRules().getRuleSet();
        if(ruleSetWithComputableCharacteristics == null) {
            EmptyResponseException ex = new EmptyResponseException("Rules", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        Decision[] orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithComputableCharacteristics, informationTable);
        Classification classification = calculateClassification(informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithComputableCharacteristics, orderOfDecisions);
        project.setClassification(classification);

        return classification;
    }

    public Classification postClassification(UUID id, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = project.getRules().getRuleSet();
        if(ruleSetWithComputableCharacteristics == null) {
            EmptyResponseException ex = new EmptyResponseException("Rules", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        Decision[] orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithComputableCharacteristics, informationTable);
        Classification classification = calculateClassification(informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithComputableCharacteristics, orderOfDecisions);
        project.setClassification(classification);

        return classification;
    }
}
