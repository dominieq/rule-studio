package pl.put.poznan.rulestudio.service;

import javafx.util.Pair;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.enums.MisclassificationMatrixType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.*;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.UUID;

@Service
public class MisclassificationMatrixService {

    private static Logger logger = LoggerFactory.getLogger(MisclassificationMatrixService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private OrdinalMisclassificationMatrix extractOrdinalMisclassificationMatrixFromProject(Project project, MisclassificationMatrixType typeOfMatrix, Integer numberOfFold) {
        OrdinalMisclassificationMatrix ordinalMisclassificationMatrix = null;
        Classification classification;
        CrossValidation crossValidation;

        switch (typeOfMatrix) {
            case CLASSIFICATION:
                classification = ClassificationService.getClassificationFromProject(project);
                ordinalMisclassificationMatrix = classification.getOrdinalMisclassificationMatrix();
                break;

            case CROSS_VALIDATION_SUM:
                crossValidation = CrossValidationService.getCrossValidationFromProject(project);
                ordinalMisclassificationMatrix = crossValidation.getSumOrdinalMisclassificationMatrix();
                break;

            case CROSS_VALIDATION_MEAN:
                crossValidation = CrossValidationService.getCrossValidationFromProject(project);
                ordinalMisclassificationMatrix = crossValidation.getMeanOrdinalMisclassificationMatrix();
                break;

            case CROSS_VALIDATION_FOLD:
                crossValidation = CrossValidationService.getCrossValidationFromProject(project);
                CrossValidationSingleFold[] crossValidationSingleFolds = crossValidation.getCrossValidationSingleFolds();
                if(numberOfFold == null) {
                    WrongParameterException ex = new WrongParameterException(String.format("The number of fold is not given."));
                    logger.error(ex.getMessage());
                    throw ex;
                }
                try {
                    ordinalMisclassificationMatrix = crossValidationSingleFolds[numberOfFold].getClassificationValidationTable().getOrdinalMisclassificationMatrix();
                } catch (ArrayIndexOutOfBoundsException e) {
                    WrongParameterException ex = new WrongParameterException(String.format("There is no fold with number {}.", numberOfFold));
                    logger.error(ex.getMessage());
                    throw ex;
                }
                break;

            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of misclassification matrix \"%s\" is unrecognized.", typeOfMatrix));
                logger.error(ex.getMessage());
                throw ex;
        }

        return ordinalMisclassificationMatrix;
    }

    public OrdinalMisclassificationMatrix getMisclassificationMatrix(UUID id, MisclassificationMatrixType typeOfMatrix, Integer numberOfFold) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfMatrix:\t{}", typeOfMatrix);
        if(numberOfFold != null) logger.info("NumberOfFold:\t{}", numberOfFold);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        OrdinalMisclassificationMatrix ordinalMisclassificationMatrix = extractOrdinalMisclassificationMatrixFromProject(project, typeOfMatrix, numberOfFold);

        logger.debug(ordinalMisclassificationMatrix.toString());
        return ordinalMisclassificationMatrix;
    }

    public Pair<String, Resource> download(UUID id, MisclassificationMatrixType typeOfMatrix, Integer numberOfFold) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfMatrix:\t{}", typeOfMatrix);
        if(numberOfFold != null) logger.info("NumberOfFold:\t{}", numberOfFold);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        OrdinalMisclassificationMatrix ordinalMisclassificationMatrix = extractOrdinalMisclassificationMatrixFromProject(project, typeOfMatrix, numberOfFold);

        String filename;
        switch (typeOfMatrix) {
            case CLASSIFICATION:
                filename = project.getName() + " misclassification matrix (classification).txt";
                break;

            case CROSS_VALIDATION_SUM:
                filename = project.getName() + " misclassification matrix (cross-validation sum).txt";
                break;

            case CROSS_VALIDATION_MEAN:
                filename = project.getName() + " misclassification matrix (cross-validation mean).txt";
                break;

            case CROSS_VALIDATION_FOLD:
                if(numberOfFold == null) {
                    WrongParameterException ex = new WrongParameterException(String.format("The number of fold is not given."));
                    logger.error(ex.getMessage());
                    throw ex;
                }
                filename = project.getName() + " misclassification matrix (cross-validation fold " + numberOfFold + ").txt";
                break;

            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of misclassification matrix \"%s\" is unrecognized.", typeOfMatrix));
                logger.error(ex.getMessage());
                throw ex;
        }

        String matrixString = ordinalMisclassificationMatrix.serialize();

        InputStream is = new ByteArrayInputStream(matrixString.getBytes());
        InputStreamResource resource = new InputStreamResource(is);

        return new Pair<>(filename, resource);
    }
}
