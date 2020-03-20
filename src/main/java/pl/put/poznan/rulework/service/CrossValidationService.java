package pl.put.poznan.rulework.service;

import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithComputableCharacteristics;
import org.rulelearn.sampling.CrossValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.model.*;

import java.util.Random;
import java.util.UUID;

@Service
public class CrossValidationService {

    private static final Logger logger = LoggerFactory.getLogger(CrossValidationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private void calculateCrossValidation(Project project, Integer numberOfFolds) {
        CrossValidator crossValidator = new CrossValidator(new Random());
        CrossValidation crossValidation = new CrossValidation(numberOfFolds, crossValidator.splitIntoKFold(project.getInformationTable(), numberOfFolds));
        project.setCrossValidation(crossValidation);
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

    public CrossValidation putCrossValidation(UUID id, Integer numberOfFolds) {
        logger.info("Id:\t{}", id);
        logger.info("NumberOfFolds:\t{}", numberOfFolds);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = project.getRuleSetWithComputableCharacteristics();
        if(ruleSetWithComputableCharacteristics == null) {
            EmptyResponseException ex = new EmptyResponseException("Rules", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        calculateCrossValidation(project, numberOfFolds);

        logger.debug("crossValidation:\t{}", project.getCrossValidation().toString());
        return project.getCrossValidation();
    }
}
