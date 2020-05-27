package pl.put.poznan.rulestudio.service;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.rulelearn.sampling.CrossValidator;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.exception.EmptyResponseException;
import pl.put.poznan.rulestudio.exception.NoDataException;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.*;

import java.io.IOException;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class CrossValidationService {

    private static final Logger logger = LoggerFactory.getLogger(CrossValidationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static CrossValidation getCrossValidationFromProject(Project project) {
        CrossValidation crossValidation = project.getCrossValidation();
        if(crossValidation == null) {
            EmptyResponseException ex = new EmptyResponseException("Cross-validation hasn't been calculated.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return crossValidation;
    }

    private CrossValidation calculateCrossValidation(InformationTable informationTable, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, Integer numberOfFolds, Long seed) {
        if(informationTable == null) {
            NoDataException ex = new NoDataException("There is no data in project. Couldn't calculate cross-validation.");
            logger.error(ex.getMessage());
            throw ex;
        }
        if(informationTable.getNumberOfObjects() == 0) {
            NoDataException ex = new NoDataException("There are no objects in project. Couldn't calculate cross-validation.");
            logger.error(ex.getMessage());
            throw ex;
        }

        if(numberOfFolds < 2) {
            WrongParameterException ex = new WrongParameterException(String.format("There must be at least 2 folds, %d is not enough. Couldn't calculate cross-validation.", numberOfFolds));
            logger.error(ex.getMessage());
            throw ex;
        }
        if(numberOfFolds > informationTable.getNumberOfObjects()) {
            WrongParameterException ex = new WrongParameterException(String.format("Number of folds shouldn't be greater than number of objects. %d folds is more than %d objects. Couldn't calculate cross-validation.", numberOfFolds, informationTable.getNumberOfObjects()));
            logger.error(ex.getMessage());
            throw ex;
        }

        CrossValidationSingleFold crossValidationSingleFolds[] = new CrossValidationSingleFold[numberOfFolds];
        Decision[] orderOfDecisions = informationTable.getOrderedUniqueFullyDeterminedDecisions();
        OrdinalMisclassificationMatrix[] foldOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix[numberOfFolds];

        CrossValidator crossValidator = new CrossValidator(new Random());
        crossValidator.setSeed(seed);
        List<CrossValidator.CrossValidationFold<InformationTable>> folds = crossValidator.splitStratifiedIntoKFold(DataService.createInformationTableWithDecisionDistributions(informationTable), numberOfFolds);
        for(int i = 0; i < folds.size(); i++) {
            logger.info("Creating fold: {}/{}", i+1, folds.size());

            InformationTable trainingTable = folds.get(i).getTrainingTable();
            InformationTable validationTable = folds.get(i).getValidationTable();

            UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = UnionsService.calculateUnionsWithSingleLimitingDecision(trainingTable, typeOfUnions, consistencyThreshold);
            RuleSetWithCharacteristics ruleSetWithCharacteristics = RulesService.calculateRuleSetWithCharacteristics(unionsWithSingleLimitingDecision, typeOfRules);
            Classification classificationValidationTable = ClassificationService.calculateClassification(trainingTable, validationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);

            foldOrdinalMisclassificationMatrix[i] = classificationValidationTable.getOrdinalMisclassificationMatrix();

            crossValidationSingleFolds[i] = new CrossValidationSingleFold(validationTable, ruleSetWithCharacteristics, classificationValidationTable, trainingTable);

            //let garbage collector clean memory occupied by i-th fold
            folds.set(i, null);
        }

        OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(orderOfDecisions, foldOrdinalMisclassificationMatrix);
        OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(true, orderOfDecisions, foldOrdinalMisclassificationMatrix);

        CrossValidation crossValidation = new CrossValidation(numberOfFolds, crossValidationSingleFolds, meanOrdinalMisclassificationMatrix, sumOrdinalMisclassificationMatrix, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, seed, informationTable.getHash());
        return crossValidation;
    }

    public CrossValidation getCrossValidation(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        CrossValidation crossValidation = getCrossValidationFromProject(project);

        logger.debug("crossValidation:\t{}", crossValidation.toString());
        return crossValidation;
    }

    public CrossValidation putCrossValidation(UUID id, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, Integer numberOfFolds, Long seed) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("NumberOfFolds:\t{}", numberOfFolds);
        logger.info("Seed:\t{}", seed);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();

        CrossValidation crossValidation = calculateCrossValidation(informationTable, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, numberOfFolds, seed);

        project.setCrossValidation(crossValidation);

        logger.debug("crossValidation:\t{}", project.getCrossValidation().toString());
        return project.getCrossValidation();
    }

    public CrossValidation postCrossValidation(UUID id, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, Integer numberOfFolds, Long seed, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("NumberOfFolds:\t{}", numberOfFolds);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);
        logger.info("Seed:\t{}", seed);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        CrossValidation crossValidation = calculateCrossValidation(informationTable, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, numberOfFolds, seed);

        project.setCrossValidation(crossValidation);

        logger.debug("crossValidation:\t{}", project.getCrossValidation().toString());
        return project.getCrossValidation();
    }
}
