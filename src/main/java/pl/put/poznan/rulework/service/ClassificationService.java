package pl.put.poznan.rulework.service;

import it.unimi.dsi.fastutil.ints.IntArrayList;
import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.*;
import org.rulelearn.data.*;
import org.rulelearn.rules.RuleSetWithComputableCharacteristics;
import org.rulelearn.types.ElementList;
import org.rulelearn.types.EnumerationField;
import org.rulelearn.types.EnumerationFieldFactory;
import org.rulelearn.types.EvaluationField;
import org.rulelearn.validation.ClassificationValidationResult;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.exception.WrongParameterException;
import pl.put.poznan.rulework.model.Classification;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ClassificationService {

    private static final Logger logger = LoggerFactory.getLogger(ClassificationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private static SimpleEvaluatedClassificationResult createDefaultSimpleEvaluatedClassificationResult(String defaultClassificationResult, InformationTable informationTable) {
        InformationTableWithDecisionDistributions informationTableWithDecisionDistributions = new InformationTableWithDecisionDistributions(informationTable);
        SimpleEvaluatedClassificationResult simpleEvaluatedClassificationResult = null;

        switch (defaultClassificationResult) {
            case "majorityDecisionClass":
                List<Decision> modes = informationTableWithDecisionDistributions.getDecisionDistribution().getMode();
                simpleEvaluatedClassificationResult = new SimpleEvaluatedClassificationResult((SimpleDecision)modes.get(0), 1.0);
                break;
            case "medianDecisionClass":
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

    private static SimpleClassificationResult createDefaultSimpleClassificationResult(String defaultClassificationResult, InformationTable informationTable) {
        InformationTableWithDecisionDistributions informationTableWithDecisionDistributions = new InformationTableWithDecisionDistributions(informationTable);
        SimpleClassificationResult simpleClassificationResult = null;

        switch (defaultClassificationResult) {
            case "majorityDecisionClass":
                List<Decision> modes = informationTableWithDecisionDistributions.getDecisionDistribution().getMode();
                simpleClassificationResult = new SimpleClassificationResult((SimpleDecision)modes.get(0));
                break;
            case "medianDecisionClass":
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

    public static Classification calculateClassification(InformationTable informationTable, String typeOfClassifier, String typeOfDefaultClassificationResult, RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics) {
        /*logger.info("RuleSet size = {}", ruleSetWithComputableCharacteristics.size());
        for(int i = 0; i < ruleSetWithComputableCharacteristics.size(); i++) {
            logger.info("\tRegula nr {}:\t{}", i, ruleSetWithComputableCharacteristics.getRule(i));
        }*/

        Attribute[] attributes = informationTable.getAttributes();

        int decisionAttributeIndex;
        for(decisionAttributeIndex = 0; decisionAttributeIndex < attributes.length; decisionAttributeIndex++) {
            if (attributes[decisionAttributeIndex] instanceof EvaluationAttribute && ((EvaluationAttribute)attributes[decisionAttributeIndex]).getType() == AttributeType.DECISION && attributes[decisionAttributeIndex].isActive()) {
                break;
            }
        }
        EvaluationField evaluationField = (EvaluationField)informationTable.getField(0, decisionAttributeIndex);

        SimpleClassificationResult simpleClassificationResult = null;
        SimpleEvaluatedClassificationResult simpleEvaluatedClassificationResult = null;

        RuleClassifier classifier = null;

        switch (typeOfClassifier) {
            case "SimpleRuleClassifier":
                simpleClassificationResult = createDefaultSimpleClassificationResult(typeOfDefaultClassificationResult, informationTable);
                classifier = new SimpleRuleClassifier(ruleSetWithComputableCharacteristics, simpleClassificationResult);
                break;
            case "SimpleOptimizingCountingRuleClassifier":
                simpleClassificationResult = createDefaultSimpleClassificationResult(typeOfDefaultClassificationResult, informationTable);
                classifier = new SimpleOptimizingCountingRuleClassifier(ruleSetWithComputableCharacteristics, simpleClassificationResult);
                break;
            case "ScoringRuleClassifierScore":
                simpleEvaluatedClassificationResult = createDefaultSimpleEvaluatedClassificationResult(typeOfDefaultClassificationResult, informationTable);
                classifier = new ScoringRuleClassifier(ruleSetWithComputableCharacteristics, simpleEvaluatedClassificationResult, ScoringRuleClassifier.Mode.SCORE);
                break;
            case "ScoringRuleClassifierHybrid":
                simpleEvaluatedClassificationResult = createDefaultSimpleEvaluatedClassificationResult(typeOfDefaultClassificationResult, informationTable);
                classifier = new ScoringRuleClassifier(ruleSetWithComputableCharacteristics, simpleEvaluatedClassificationResult, ScoringRuleClassifier.Mode.HYBRID);
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of classifier \"%s\" is unrecognized.", typeOfClassifier));
                logger.error(ex.getMessage());
                break;
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

        EnumerationField decisionEnumerationField = (EnumerationField)evaluationField;
        ElementList elementList = decisionEnumerationField.getElementList();
        AttributePreferenceType attributePreferenceType = decisionEnumerationField.getPreferenceType();
        Decision[] decisionsDomain = new Decision[elementList.getSize()];
        for(int i = 0; i < elementList.getSize(); i++) {
            EnumerationField enumerationField = EnumerationFieldFactory.getInstance().create(elementList, i, attributePreferenceType);
            decisionsDomain[i] = DecisionFactory.INSTANCE.create(
                    new EnumerationField[] {enumerationField},
                    new int[] {decisionAttributeIndex});
        }
        OrdinalMisclassificationMatrix ordinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(informationTable.getOrderedUniqueFullyDeterminedDecisions(), informationTable.getDecisions(), suggestedDecisions);

        Classification classification = new Classification(classificationResults, informationTable, decisionsDomain, indicesOfCoveringRules, ordinalMisclassificationMatrix);
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

    public Classification putClassification(UUID id, String typeOfClassifier, String defaultClassificationResult) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);
        InformationTable informationTable = project.getInformationTable();

        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = project.getRuleSetWithComputableCharacteristics();
        if(ruleSetWithComputableCharacteristics == null) {
            EmptyResponseException ex = new EmptyResponseException("Rules", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        Classification classification = calculateClassification(informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithComputableCharacteristics);
        project.setClassification(classification);

        return classification;
    }

    public Classification putClassificationNewData(
            UUID id,
            String typeOfClassifier,
            String defaultClassificationResult,
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

        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = project.getRuleSetWithComputableCharacteristics();
        if(ruleSetWithComputableCharacteristics == null) {
            EmptyResponseException ex = new EmptyResponseException("Rules", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        Classification classification = calculateClassification(informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithComputableCharacteristics);
        project.setClassification(classification);

        return classification;
    }

    public Classification postClassification(UUID id, String typeOfClassifier, String defaultClassificationResult, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = project.getRuleSetWithComputableCharacteristics();
        if(ruleSetWithComputableCharacteristics == null) {
            EmptyResponseException ex = new EmptyResponseException("Rules", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        Classification classification = calculateClassification(informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithComputableCharacteristics);
        project.setClassification(classification);

        return classification;
    }
}
