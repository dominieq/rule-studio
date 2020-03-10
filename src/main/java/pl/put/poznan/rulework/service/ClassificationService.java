package pl.put.poznan.rulework.service;

import org.rulelearn.classification.*;
import org.rulelearn.data.*;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.exception.ProjectNotFoundException;
import pl.put.poznan.rulework.model.Classification;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

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

    public Classification getClassification(UUID id) {
        logger.info("Id;\t{}", id);

        Project project = getProjectFromProjectsContainer(id);

        return project.getClassification();
    }

    public Classification putClassification(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = getProjectFromProjectsContainer(id);
        InformationTable informationTable = project.getInformationTable();

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
        //SimpleRuleClassifier classifier = new SimpleRuleClassifier(project.getRuleSetWithComputableCharacteristics(), simpleClassificationResult);
        //SimpleOptimizingRuleClassifier classifier = new SimpleOptimizingRuleClassifier(project.getRuleSetWithComputableCharacteristics(), simpleClassificationResult, informationTable);
        //SimpleOptimizingCountingRuleClassifier classifier = new SimpleOptimizingCountingRuleClassifier(project.getRuleSetWithComputableCharacteristics(), simpleClassificationResult, informationTable);
        SimpleOptimizingCountingRuleClassifier classifier = new SimpleOptimizingCountingRuleClassifier(project.getRuleSetWithComputableCharacteristics(), defaultClassificationResult);

        SimpleClassificationResult[] simpleClassificationResults = classifier.classifyAll(informationTable);
        Classification classification = new Classification(simpleClassificationResults);
        project.setClassification(classification);
        return classification;
    }
}
