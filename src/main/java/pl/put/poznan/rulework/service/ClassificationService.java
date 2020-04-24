package pl.put.poznan.rulework.service;

import it.unimi.dsi.fastutil.ints.IntArrayList;
import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.*;
import org.rulelearn.core.TernaryLogicValue;
import org.rulelearn.data.*;
import org.rulelearn.rules.Rule;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.rulelearn.types.EvaluationField;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.enums.ClassifierType;
import pl.put.poznan.rulework.enums.DefaultClassificationResultType;
import pl.put.poznan.rulework.exception.*;
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

    public static Classification getClassificationFromProject(Project project) {
        Classification classification = project.getClassification();
        if(classification == null) {
            EmptyResponseException ex = new EmptyResponseException("Classification hasn't been calculated.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return classification;
    }

    private static Decision[] induceOrderedUniqueFullyDeterminedDecisions(RuleSetWithCharacteristics ruleSetWithCharacteristics, InformationTable informationTable) {
        List<Decision> allDecisions = new ArrayList<>();

        Decision[] informationTableDecisions = informationTable.getOrderedUniqueFullyDeterminedDecisions();
        for(int i = 0; i < informationTableDecisions.length; i++) {
            allDecisions.add(informationTableDecisions[i]);
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

    private static void checkLearningInformationTableCompatibility(InformationTable learningInformationTable, RuleSetWithCharacteristics ruleSetWithCharacteristics) {
        String ruleSetHash = ruleSetWithCharacteristics.getLearningInformationTableHash();
        if(ruleSetHash == null) {
            NoHashInRuleSetException ex = new NoHashInRuleSetException("Provided rules set doesn't have learning information table hash. It can't be determined, if this rules set was generated based on given learning information table. Chosen classifier can't be used.");
            logger.error(ex.getMessage());
            throw ex;
        }

        if(!ruleSetHash.equals(learningInformationTable.getHash())) {
            IncompatibleLearningInformationTableException ex = new IncompatibleLearningInformationTableException("Data in current project should be a valid training set for existing rules. Access to this set is required to be able to use chosen classifier.");
            logger.error(ex.getMessage());
            throw ex;
        }

        logger.info("Learning information table and rule set are compatible.");
    }

    public static Classification calculateClassification(InformationTable learningInformationTable, InformationTable testingInformationTable, ClassifierType typeOfClassifier, DefaultClassificationResultType typeOfDefaultClassificationResult, RuleSetWithCharacteristics ruleSetWithCharacteristics, Decision[] orderOfDecisions) {
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
                simpleClassificationResult = createDefaultSimpleClassificationResult(typeOfDefaultClassificationResult, testingInformationTable);
                classifier = new SimpleRuleClassifier(ruleSetWithCharacteristics, simpleClassificationResult);
                break;
            case SIMPLE_OPTIMIZING_COUNTING_RULE_CLASSIFIER:
                simpleClassificationResult = createDefaultSimpleClassificationResult(typeOfDefaultClassificationResult, testingInformationTable);
                checkLearningInformationTableCompatibility(learningInformationTable, ruleSetWithCharacteristics);
                classifier = new SimpleOptimizingCountingRuleClassifier(ruleSetWithCharacteristics, simpleClassificationResult, learningInformationTable);
                break;
            case SCORING_RULE_CLASSIFIER_SCORE:
                simpleEvaluatedClassificationResult = createDefaultSimpleEvaluatedClassificationResult(typeOfDefaultClassificationResult, testingInformationTable);
                checkLearningInformationTableCompatibility(learningInformationTable, ruleSetWithCharacteristics);
                classifier = new ScoringRuleClassifier(ruleSetWithCharacteristics, simpleEvaluatedClassificationResult, ScoringRuleClassifier.Mode.SCORE, learningInformationTable);
                break;
            case SCORING_RULE_CLASSIFIER_HYBRID:
                simpleEvaluatedClassificationResult = createDefaultSimpleEvaluatedClassificationResult(typeOfDefaultClassificationResult, testingInformationTable);
                checkLearningInformationTableCompatibility(learningInformationTable, ruleSetWithCharacteristics);
                classifier = new ScoringRuleClassifier(ruleSetWithCharacteristics, simpleEvaluatedClassificationResult, ScoringRuleClassifier.Mode.HYBRID, learningInformationTable);
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of classifier \"%s\" is unrecognized.", typeOfClassifier));
                logger.error(ex.getMessage());
                throw ex;
        }

        int objectIndex;
        int objectCount = testingInformationTable.getNumberOfObjects();
        IntList[] indicesOfCoveringRules = new IntList[objectCount];

        ClassificationResult[] classificationResults = new ClassificationResult[objectCount];
        for (objectIndex = 0; objectIndex < classificationResults.length; objectIndex++) {
            indicesOfCoveringRules[objectIndex] = new IntArrayList();
            classificationResults[objectIndex] = classifier.classify(objectIndex, testingInformationTable, indicesOfCoveringRules[objectIndex]);
        }

        if(logger.isDebugEnabled()) {
            for(objectIndex = 0; objectIndex < objectCount; objectIndex++) {
                logger.debug("Obiekt nr {}:\t{}", objectIndex, testingInformationTable.getFields(objectIndex).toString());
                for(int ruleIndex = 0; ruleIndex < indicesOfCoveringRules[objectIndex].size(); ruleIndex++) {
                    logger.debug("\tRegula nr {}:\t{}", ruleIndex, ruleSetWithCharacteristics.getRule(indicesOfCoveringRules[objectIndex].getInt(ruleIndex)));
                }
            }
        }

        Decision[] suggestedDecisions = new Decision[classificationResults.length];
        for(int i = 0; i < classificationResults.length; i++) {
            suggestedDecisions[i] = classificationResults[i].getSuggestedDecision();
        }
        OrdinalMisclassificationMatrix ordinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(orderOfDecisions, testingInformationTable.getDecisions(), suggestedDecisions);

        Classification classification = new Classification(classificationResults, testingInformationTable, orderOfDecisions, indicesOfCoveringRules, ordinalMisclassificationMatrix, typeOfClassifier, typeOfDefaultClassificationResult);
        return classification;
    }

    public Classification getClassification(UUID id) {
        logger.info("Id;\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        Classification classification = getClassificationFromProject(project);

        logger.debug("classification:\t{}", classification);
        return classification;
    }

    public Classification putClassification(UUID id, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();
        if(informationTable == null) {
            NoDataException ex = new NoDataException("There is no data in project. Couldn't reclassify.");
            logger.error(ex.getMessage());
            throw ex;
        }

        if(project.getRules() == null) {
            NoRulesException ex = new NoRulesException("There are no rules in this project. Calculate or upload rules to classify data.");
            logger.error(ex.getMessage());
            throw ex;
        }
        RuleSetWithCharacteristics ruleSetWithCharacteristics = project.getRules().getRuleSet();

        Decision[] orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithCharacteristics, informationTable);
        Classification classification = calculateClassification(informationTable, informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);
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

        InformationTable projectInformationTable = project.getInformationTable();
        if(projectInformationTable == null) {
            NoDataException ex = new NoDataException("There is no data in project. Couldn't classify data from file.");
            logger.error(ex.getMessage());
            throw ex;
        }

        Attribute[] attributes = projectInformationTable.getAttributes();
        if(attributes == null) {
            NoDataException ex = new NoDataException("There is no metadata in project. Couldn't read classified data from file.");
            logger.error(ex.getMessage());
            throw ex;
        }

        InformationTable newInformationTable = DataService.informationTableFromMultipartFileData(dataFile, attributes, separator, header);

        if(project.getRules() == null) {
            NoRulesException ex = new NoRulesException("There are no rules in this project. Calculate or upload rules to classify data.");
            logger.error(ex.getMessage());
            throw ex;
        }
        RuleSetWithCharacteristics ruleSetWithCharacteristics = project.getRules().getRuleSet();

        Decision[] orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithCharacteristics, newInformationTable);
        Classification classification = calculateClassification(projectInformationTable, newInformationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);
        classification.setExternalData(true);
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

        if(project.getRules() == null) {
            NoRulesException ex = new NoRulesException("There are no rules in this project. Calculate or upload rules to classify data.");
            logger.error(ex.getMessage());
            throw ex;
        }
        RuleSetWithCharacteristics ruleSetWithCharacteristics = project.getRules().getRuleSet();

        Decision[] orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithCharacteristics, informationTable);
        Classification classification = calculateClassification(informationTable, informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);
        project.setClassification(classification);

        return classification;
    }
}
