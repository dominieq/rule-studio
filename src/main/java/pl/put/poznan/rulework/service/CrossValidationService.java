package pl.put.poznan.rulework.service;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithComputableCharacteristics;
import org.rulelearn.sampling.CrossValidator;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.model.*;

import java.io.IOException;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class CrossValidationService {

    private static final Logger logger = LoggerFactory.getLogger(CrossValidationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private CrossValidation calculateCrossValidation(InformationTable informationTable, String typeOfUnions, Double consistencyThreshold, String typeOfClassifier, String defaultClassificationResult, Integer numberOfFolds) {
        CrossValidationSingleFold crossValidationSingleFolds[] = new CrossValidationSingleFold[numberOfFolds];
        Decision[] orderOfDecisions = informationTable.getOrderedUniqueFullyDeterminedDecisions();
        OrdinalMisclassificationMatrix[] foldOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix[numberOfFolds];

        CrossValidator crossValidator = new CrossValidator(new Random());
        List<CrossValidator.CrossValidationFold<InformationTable>> folds = crossValidator.splitIntoKFold(informationTable, numberOfFolds);
        for(int i = 0; i < folds.size(); i++) {
            logger.info("Creating fold: {}/{}", i+1, folds.size());

            InformationTable trainingTable = folds.get(i).getTrainingTable();
            InformationTable validationTable = folds.get(i).getValidationTable();

            UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = UnionsWithSingleLimitingDecisionService.calculateUnionsWithSingleLimitingDecision(trainingTable, typeOfUnions, consistencyThreshold);
            RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = RulesService.calculateRuleSetWithComputableCharacteristics(unionsWithSingleLimitingDecision);
            Classification classificationValidationTable = ClassificationService.calculateClassification(validationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithComputableCharacteristics, orderOfDecisions);

            foldOrdinalMisclassificationMatrix[i] = classificationValidationTable.getOrdinalMisclassificationMatrix();

            crossValidationSingleFolds[i] = new CrossValidationSingleFold(validationTable, ruleSetWithComputableCharacteristics, classificationValidationTable);
        }

        OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(orderOfDecisions, foldOrdinalMisclassificationMatrix);

        CrossValidation crossValidation = new CrossValidation(numberOfFolds, crossValidationSingleFolds, meanOrdinalMisclassificationMatrix);
        return crossValidation;
    }

    public CrossValidation getCrossValidation(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        CrossValidation crossValidation = project.getCrossValidation();
        if(crossValidation == null) {
            EmptyResponseException ex = new EmptyResponseException("Cross-validation", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        logger.debug("crossValidation:\t{}", crossValidation.toString());
        return crossValidation;
    }

    public CrossValidation putCrossValidation(UUID id, String typeOfUnions, Double consistencyThreshold, String typeOfClassifier, String defaultClassificationResult, Integer numberOfFolds) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("NumberOfFolds:\t{}", numberOfFolds);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        CrossValidation crossValidation = calculateCrossValidation(project.getInformationTable(), typeOfUnions, consistencyThreshold, typeOfClassifier, defaultClassificationResult, numberOfFolds);

        project.setCrossValidation(crossValidation);

        logger.debug("crossValidation:\t{}", project.getCrossValidation().toString());
        return project.getCrossValidation();
    }

    public CrossValidation postCrossValidation(UUID id, String typeOfUnions, Double consistencyThreshold, String typeOfClassifier, String defaultClassificationResult, Integer numberOfFolds, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("NumberOfFolds:\t{}", numberOfFolds);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        CrossValidation crossValidation = calculateCrossValidation(project.getInformationTable(), typeOfUnions, consistencyThreshold, typeOfClassifier, defaultClassificationResult, numberOfFolds);

        project.setCrossValidation(crossValidation);

        logger.debug("crossValidation:\t{}", project.getCrossValidation().toString());
        return project.getCrossValidation();
    }
}
