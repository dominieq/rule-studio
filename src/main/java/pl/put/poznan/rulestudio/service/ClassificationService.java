package pl.put.poznan.rulestudio.service;

import it.unimi.dsi.fastutil.ints.IntArrayList;
import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.*;
import org.rulelearn.core.TernaryLogicValue;
import org.rulelearn.data.*;
import org.rulelearn.rules.Rule;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.rulelearn.types.EvaluationField;
import org.rulelearn.types.UnknownSimpleFieldMV2;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.exception.*;
import pl.put.poznan.rulestudio.model.Classification;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;
import pl.put.poznan.rulestudio.model.response.ChosenClassifiedObjectResponse;
import pl.put.poznan.rulestudio.model.response.ChosenClassifiedObjectResponse.ChosenClassifiedObjectResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ChosenRuleResponse;
import pl.put.poznan.rulestudio.model.response.ChosenRuleResponse.ChosenRuleResponseBuilder;
import pl.put.poznan.rulestudio.model.response.MainClassificationResponse;
import pl.put.poznan.rulestudio.model.response.MainClassificationResponse.MainClassificationResponseBuilder;

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

    private static SimpleEvaluatedClassificationResult createDefaultSimpleEvaluatedClassificationResult(DefaultClassificationResultType defaultClassificationResult, InformationTable informationTable) {
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

    private static SimpleClassificationResult createDefaultSimpleClassificationResult(DefaultClassificationResultType defaultClassificationResult, InformationTable informationTable) {
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

    private static void checkLearningInformationTableCompatibility(InformationTable learningInformationTable, RuleSetWithCharacteristics ruleSetWithCharacteristics) {
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

        Classification classification = new Classification(classificationResults, testingInformationTable, orderOfDecisions, indicesOfCoveringRules, ordinalMisclassificationMatrix, typeOfClassifier, typeOfDefaultClassificationResult, learningInformationTable.getHash(), ruleSetWithCharacteristics.getHash());
        return classification;
    }

    private static void checkInformationTable(InformationTable informationTable, String message) {
        if(informationTable == null) {
            NoDataException ex = new NoDataException(message);
            logger.error(ex.getMessage());
            throw ex;
        }
    }

    private static void checkNumberOfClassifiedObjects(int numberOfObjects, String message) {
        if(numberOfObjects == 0) {
            NoDataException ex = new NoDataException(message);
            logger.error(ex.getMessage());
            throw ex;
        }
    }

    private static RuleSetWithCharacteristics getRuleSetToClassify(Project project) {
        if(project.getRules() == null) {
            NoRulesException ex = new NoRulesException("There are no rules in this project. Calculate or upload rules to classify data.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return project.getRules().getRuleSet();
    }

    public MainClassificationResponse getClassification(UUID id) {
        logger.info("Id;\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final Classification classification = getClassificationFromProject(project);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(classification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse putClassification(UUID id, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = project.getInformationTable();
        checkInformationTable(informationTable, "There is no data in project. Couldn't reclassify.");

        checkNumberOfClassifiedObjects(informationTable.getNumberOfObjects(), "There are no objects in project. Couldn't reclassify.");

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = getRuleSetToClassify(project);

        final Decision[] orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithCharacteristics, informationTable);
        final Classification classification = calculateClassification(informationTable, informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);
        project.setClassification(classification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(classification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse putClassificationNewData(
            UUID id,
            ClassifierType typeOfClassifier,
            DefaultClassificationResultType defaultClassificationResult,
            MultipartFile externalDataFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("Data:\t{}\t{}", externalDataFile.getOriginalFilename(), externalDataFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable projectInformationTable = project.getInformationTable();
        checkInformationTable(projectInformationTable, "There is no data in project. Couldn't classify data from file.");

        final Attribute[] attributes = projectInformationTable.getAttributes();
        if(attributes == null) {
            NoDataException ex = new NoDataException("There is no metadata in project. Couldn't read classified data from file.");
            logger.error(ex.getMessage());
            throw ex;
        }

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = getRuleSetToClassify(project);

        final InformationTable newInformationTable = DataService.informationTableFromMultipartFileData(externalDataFile, attributes, separator, header);
        checkInformationTable(newInformationTable, "There is no data in external file. Couldn't classify.");
        checkNumberOfClassifiedObjects(newInformationTable.getNumberOfObjects(), "There are no objects in external data. Couldn't classify.");

        final Decision[] orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithCharacteristics, newInformationTable);
        final Classification classification = calculateClassification(projectInformationTable, newInformationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);
        classification.setExternalData(true);
        classification.setExternalDataFileName(externalDataFile.getOriginalFilename());
        project.setClassification(classification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(classification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse postClassification(UUID id, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        checkNumberOfClassifiedObjects(informationTable.getNumberOfObjects(), "There are no objects in project. Couldn't reclassify.");

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = getRuleSetToClassify(project);

        final Decision[] orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithCharacteristics, informationTable);
        final Classification classification = calculateClassification(informationTable, informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);
        project.setClassification(classification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(classification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse postClassificationNewData(
            UUID id,
            ClassifierType typeOfClassifier,
            DefaultClassificationResultType defaultClassificationResult,
            String metadata,
            String data,
            MultipartFile externalDataFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);
        logger.info("ExternalDataFile:\t{}\t{}", externalDataFile.getOriginalFilename(), externalDataFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable projectInformationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(projectInformationTable);

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = getRuleSetToClassify(project);

        final InformationTable newInformationTable = DataService.informationTableFromMultipartFileData(externalDataFile, projectInformationTable.getAttributes(), separator, header);
        checkInformationTable(newInformationTable, "There is no data in external file. Couldn't classify.");
        checkNumberOfClassifiedObjects(newInformationTable.getNumberOfObjects(), "There are no objects in external data. Couldn't classify.");

        final Decision[] orderOfDecisions = induceOrderedUniqueFullyDeterminedDecisions(ruleSetWithCharacteristics, newInformationTable);
        final Classification classification = calculateClassification(projectInformationTable, newInformationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);
        classification.setExternalData(true);
        classification.setExternalDataFileName(externalDataFile.getOriginalFilename());
        project.setClassification(classification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(classification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public ChosenClassifiedObjectResponse getChosenClassifiedObject(UUID id, Integer classifiedObjectIndex) {
        logger.info("Id;\t{}", id);
        logger.info("ClassifiedObjectIndex:\t{}", classifiedObjectIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final Classification classification = getClassificationFromProject(project);

        final ChosenClassifiedObjectResponse chosenClassifiedObjectResponse = ChosenClassifiedObjectResponseBuilder.newInstance().build(classification, classifiedObjectIndex);
        logger.debug("chosenClassifiedObjectResponse:\t{}", chosenClassifiedObjectResponse);
        return chosenClassifiedObjectResponse;
    }

    public ChosenRuleResponse getRuleCoveringObjects(UUID id, Integer ruleIndex) {
        logger.info("Id;\t{}", id);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        getClassificationFromProject(project);

        final ChosenRuleResponse chosenRuleResponse = ChosenRuleResponseBuilder.newInstance().build(project.getRules().getRuleSet(), ruleIndex);
        logger.debug("chosenRuleResponse:\t{}", chosenRuleResponse);
        return chosenRuleResponse;
    }
}
