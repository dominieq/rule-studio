package pl.put.poznan.rulework.service;

import it.unimi.dsi.fastutil.ints.IntArrayList;
import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.*;
import org.rulelearn.data.*;
import org.rulelearn.rules.RuleSetWithComputableCharacteristics;
import org.rulelearn.types.EvaluationField;
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

        int i;
        for(i = 0; i < attributes.length; i++) {
            if (attributes[i] instanceof EvaluationAttribute && ((EvaluationAttribute)attributes[i]).getType() == AttributeType.DECISION && attributes[i].isActive()) {
                break;
            }
        }
        EvaluationField evaluationField = (EvaluationField)informationTable.getField(0, i);

        SimpleDecision defaultDecision = new SimpleDecision(evaluationField, i);
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
        IntList[] indicesOfCoveredObjects = new IntList[rulesCount];


        for(ruleIndex = 0; ruleIndex < rulesCount; ruleIndex++) {
            indicesOfCoveredObjects[ruleIndex] = new IntArrayList();
        }

        for(objectIndex = 0; objectIndex < objectCount; objectIndex++) {
            indicesOfCoveringRules[objectIndex] = new IntArrayList();

            for(ruleIndex = 0; ruleIndex < rulesCount; ruleIndex++) {

                if (ruleSetWithComputableCharacteristics.getRule(ruleIndex).covers(objectIndex, informationTable)) { //current rule covers considered object
                    indicesOfCoveringRules[objectIndex].add(ruleIndex);
                    indicesOfCoveredObjects[ruleIndex].add(objectIndex);
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

        Classification classification = new Classification(simpleClassificationResults, informationTable, indicesOfCoveringRules, indicesOfCoveredObjects);
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
