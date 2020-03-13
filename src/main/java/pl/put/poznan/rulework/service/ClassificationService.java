package pl.put.poznan.rulework.service;

import it.unimi.dsi.fastutil.ints.IntArrayList;
import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.*;
import org.rulelearn.data.*;
import org.rulelearn.data.csv.ObjectParser;
import org.rulelearn.rules.RuleSetWithComputableCharacteristics;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.exception.ProjectNotFoundException;
import pl.put.poznan.rulework.model.Classification;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.UUID;

@Service
public class ClassificationService {

    private static final Logger logger = LoggerFactory.getLogger(ClassificationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private Project getProjectFromProjectsContainer(UUID id) {
        Project project = projectsContainer.getProjectHashMap().get(id);
        if(project == null) {
            ProjectNotFoundException ex = new ProjectNotFoundException(id);
            logger.error(ex.getMessage());
            throw ex;
        }

        return project;
    }

    private Classification makeClassification(InformationTable informationTable, RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics) {
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

        IntList[] indiciesOfCoveringRules = new IntList[objectCount];
        IntList[] indiciesOfCoveredObjects = new IntList[rulesCount];


        for(ruleIndex = 0; ruleIndex < rulesCount; ruleIndex++) {
            indiciesOfCoveredObjects[ruleIndex] = new IntArrayList();
        }

        for(objectIndex = 0; objectIndex < objectCount; objectIndex++) {
            indiciesOfCoveringRules[objectIndex] = new IntArrayList();

            for(ruleIndex = 0; ruleIndex < rulesCount; ruleIndex++) {

                if (ruleSetWithComputableCharacteristics.getRule(ruleIndex).covers(objectIndex, informationTable)) { //current rule covers considered object
                    indiciesOfCoveringRules[objectIndex].add(ruleIndex);
                    indiciesOfCoveredObjects[ruleIndex].add(objectIndex);
                }
            }
        }

        for(objectIndex = 0; objectIndex < objectCount; objectIndex++) {
            logger.info("Obiekt nr {}:\t{}", objectIndex, informationTable.getFields(objectIndex).toString());
            for(ruleIndex = 0; ruleIndex < indiciesOfCoveringRules[objectIndex].size(); ruleIndex++) {
                logger.info("\tRegula nr {}:\t{}", ruleIndex, ruleSetWithComputableCharacteristics.getRule(indiciesOfCoveringRules[objectIndex].getInt(ruleIndex)));
            }
        }

        Classification classification = new Classification(simpleClassificationResults, informationTable, indiciesOfCoveringRules, indiciesOfCoveredObjects);
        return classification;
    }

    public Classification getClassification(UUID id) {
        logger.info("Id;\t{}", id);

        Project project = getProjectFromProjectsContainer(id);

        return project.getClassification();
    }

    public Classification putClassification(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = getProjectFromProjectsContainer(id);
        InformationTable informationTable = project.getInformationTable();

        Classification classification = makeClassification(informationTable, project.getRuleSetWithComputableCharacteristics());
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

        Project project = getProjectFromProjectsContainer(id);

        Reader reader;
        InformationTable informationTable = project.getInformationTable();
        Attribute[] attributes = project.getInformationTable().getAttributes();

        if (dataFile.getContentType().equals("application/json")) {
            logger.info("Data type is json");
            org.rulelearn.data.json.ObjectParser objectParser = new org.rulelearn.data.json.ObjectParser.Builder(attributes).build();
            reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = objectParser.parseObjects(reader);

        } else if (dataFile.getContentType().equals("application/vnd.ms-excel")) {
            logger.info("Data type is csv");
            ObjectParser objectParser = new ObjectParser.Builder(attributes).
                    separator(separator).
                    header(header).
                    build();
            reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = objectParser.parseObjects(reader);
        } else {
            logger.error("Unrecognized format of data file: " + dataFile.getContentType());
        }

        if(logger.isTraceEnabled()) {
            Table<EvaluationAttribute, EvaluationField> table = informationTable.getActiveConditionAttributeFields();
            for(int i = 0; i < table.getNumberOfObjects(); i++) {
                StringBuilder sb = new StringBuilder();
                sb.append(i);
                sb.append(":");
                for(int j = 0; j < table.getNumberOfAttributes(); j++) {
                    sb.append("\t");
                    sb.append(table.getField(i, j));
                }
                logger.trace(sb.toString());
            }
        }

        Classification classification = makeClassification(informationTable, project.getRuleSetWithComputableCharacteristics());
        project.setClassification(classification);

        return classification;
    }
}
