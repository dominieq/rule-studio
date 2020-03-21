package pl.put.poznan.rulework.service;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithComputableCharacteristics;
import org.rulelearn.sampling.CrossValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.model.*;

import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class CrossValidationService {

    private static final Logger logger = LoggerFactory.getLogger(CrossValidationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private CrossValidation calculateCrossValidation(InformationTable informationTable, String typeOfUnions, Double consistencyThreshold, Integer numberOfFolds) {
        CrossValidationSingleFold crossValidationSingleFolds[] = new CrossValidationSingleFold[numberOfFolds];

        CrossValidator crossValidator = new CrossValidator(new Random());
        List<CrossValidator.CrossValidationFold<InformationTable>> folds = crossValidator.splitIntoKFold(informationTable, numberOfFolds);
        for(int i = 0; i < folds.size(); i++) {
            logger.info("Creating fold: {}/{}", i+1, folds.size());

            InformationTable trainingTable = folds.get(i).getTrainingTable();
            InformationTable validationTable = folds.get(i).getValidationTable();

            UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = UnionsWithSingleLimitingDecisionService.calculateUnionsWithSingleLimitingDecision(trainingTable, typeOfUnions, consistencyThreshold);
            RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = RulesService.calculateRuleSetWithComputableCharacteristics(unionsWithSingleLimitingDecision);
            Classification classificationValidationTable = ClassificationService.calculateClassification(validationTable, ruleSetWithComputableCharacteristics);

            crossValidationSingleFolds[i] = new CrossValidationSingleFold(validationTable, ruleSetWithComputableCharacteristics, classificationValidationTable);
        }

        CrossValidation crossValidation = new CrossValidation(numberOfFolds, crossValidationSingleFolds);
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

    public CrossValidation putCrossValidation(UUID id, String typeOfUnions, Double consistencyThreshold, Integer numberOfFolds) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("NumberOfFolds:\t{}", numberOfFolds);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        CrossValidation crossValidation = calculateCrossValidation(project.getInformationTable(), typeOfUnions, consistencyThreshold, numberOfFolds);

        project.setCrossValidation(crossValidation);

        logger.debug("crossValidation:\t{}", project.getCrossValidation().toString());
        return project.getCrossValidation();
    }
}
