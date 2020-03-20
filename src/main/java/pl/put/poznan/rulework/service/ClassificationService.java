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
import pl.put.poznan.rulework.model.Classification;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.IOException;
import java.util.UUID;

@Service
public class ClassificationService {

    private static final Logger logger = LoggerFactory.getLogger(ClassificationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static Classification calculateClassification(InformationTable informationTable, RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics) {
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

        SimpleDecision defaultDecision = new SimpleDecision(evaluationField, decisionAttributeIndex);
        SimpleClassificationResult defaultClassificationResult = new SimpleClassificationResult(defaultDecision);
        //SimpleRuleClassifier classifier = new SimpleRuleClassifier(ruleSetWithComputableCharacteristics, simpleClassificationResult);
        //SimpleOptimizingRuleClassifier classifier = new SimpleOptimizingRuleClassifier(ruleSetWithComputableCharacteristics, simpleClassificationResult, informationTable);
        //SimpleOptimizingCountingRuleClassifier classifier = new SimpleOptimizingCountingRuleClassifier(ruleSetWithComputableCharacteristics, simpleClassificationResult, informationTable);
        SimpleOptimizingCountingRuleClassifier classifier = new SimpleOptimizingCountingRuleClassifier(ruleSetWithComputableCharacteristics, defaultClassificationResult);

        SimpleClassificationResult[] simpleClassificationResults = classifier.classifyAll(informationTable);

        int objectIndex, ruleIndex;
        int rulesCount = ruleSetWithComputableCharacteristics.size();
        int objectCount = informationTable.getNumberOfObjects();

        IntList[] indicesOfCoveringRules = new IntList[objectCount];

        for(objectIndex = 0; objectIndex < objectCount; objectIndex++) {
            indicesOfCoveringRules[objectIndex] = new IntArrayList();

            for(ruleIndex = 0; ruleIndex < rulesCount; ruleIndex++) {

                if (ruleSetWithComputableCharacteristics.getRule(ruleIndex).covers(objectIndex, informationTable)) { //current rule covers considered object
                    indicesOfCoveringRules[objectIndex].add(ruleIndex);
                }
            }
        }

        if(logger.isDebugEnabled()) {
            for(objectIndex = 0; objectIndex < objectCount; objectIndex++) {
                logger.debug("Obiekt nr {}:\t{}", objectIndex, informationTable.getFields(objectIndex).toString());
                for(ruleIndex = 0; ruleIndex < indicesOfCoveringRules[objectIndex].size(); ruleIndex++) {
                    logger.debug("\tRegula nr {}:\t{}", ruleIndex, ruleSetWithComputableCharacteristics.getRule(indicesOfCoveringRules[objectIndex].getInt(ruleIndex)));
                }
            }
        }

        Decision[] suggestedDecisions = new Decision[simpleClassificationResults.length];
        for(int i = 0; i < simpleClassificationResults.length; i++) {
            suggestedDecisions[i] = simpleClassificationResults[i].getSuggestedDecision();
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

        Classification classification = new Classification(simpleClassificationResults, informationTable, decisionsDomain, indicesOfCoveringRules, ordinalMisclassificationMatrix);
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

    public Classification putClassification(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);
        InformationTable informationTable = project.getInformationTable();

        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = project.getRuleSetWithComputableCharacteristics();
        if(ruleSetWithComputableCharacteristics == null) {
            EmptyResponseException ex = new EmptyResponseException("Rules", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        Classification classification = calculateClassification(informationTable, ruleSetWithComputableCharacteristics);
        project.setClassification(classification);

        return classification;
    }

    public Classification putClassificationNewData(
            UUID id,
            MultipartFile dataFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Id:\t{}", id);
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

        Classification classification = calculateClassification(informationTable, ruleSetWithComputableCharacteristics);
        project.setClassification(classification);

        return classification;
    }

    public Classification postClassification(UUID id, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
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

        Classification classification = calculateClassification(informationTable, ruleSetWithComputableCharacteristics);
        project.setClassification(classification);

        return classification;
    }
}
