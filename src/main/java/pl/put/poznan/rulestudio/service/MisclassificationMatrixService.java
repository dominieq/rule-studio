package pl.put.poznan.rulestudio.service;

import org.rulelearn.data.Decision;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.enums.MisclassificationMatrixType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.*;
import pl.put.poznan.rulestudio.model.response.OrdinalMisclassificationMatrixAbstractResponse;
import pl.put.poznan.rulestudio.model.response.OrdinalMisclassificationMatrixResponse.OrdinalMisclassificationMatrixResponseBuilder;
import pl.put.poznan.rulestudio.model.response.OrdinalMisclassificationMatrixWithoutDeviationResponse.OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder;

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
                    ordinalMisclassificationMatrix = crossValidationSingleFolds[numberOfFold].getClassificationOfValidationTable().getOrdinalMisclassificationMatrix();
                } catch (ArrayIndexOutOfBoundsException e) {
                    WrongParameterException ex = new WrongParameterException(String.format("There is no fold with number \"%d\".", numberOfFold));
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

    public OrdinalMisclassificationMatrixAbstractResponse getMisclassificationMatrix(UUID id, MisclassificationMatrixType typeOfMatrix, Integer numberOfFold) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfMatrix:\t{}", typeOfMatrix);
        if(numberOfFold != null) logger.info("NumberOfFold:\t{}", numberOfFold);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final OrdinalMisclassificationMatrix ordinalMisclassificationMatrix = extractOrdinalMisclassificationMatrixFromProject(project, typeOfMatrix, numberOfFold);

        Decision[] orderOfDecision;
        OrdinalMisclassificationMatrixAbstractResponse ordinalMisclassificationMatrixAbstractResponse;
        switch (typeOfMatrix) {
            case CLASSIFICATION:
                orderOfDecision = project.getClassification().getOrderOfDecisions();
                ordinalMisclassificationMatrixAbstractResponse = OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder.newInstance().build(ordinalMisclassificationMatrix, orderOfDecision);
                break;

            case CROSS_VALIDATION_MEAN:
                orderOfDecision = project.getCrossValidation().getCrossValidationSingleFolds()[0].getClassificationOfValidationTable().getOrderOfDecisions();
                ordinalMisclassificationMatrixAbstractResponse = OrdinalMisclassificationMatrixResponseBuilder.newInstance().build(ordinalMisclassificationMatrix, orderOfDecision);
                break;

            default:
                orderOfDecision = project.getCrossValidation().getCrossValidationSingleFolds()[0].getClassificationOfValidationTable().getOrderOfDecisions();
                ordinalMisclassificationMatrixAbstractResponse = OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder.newInstance().build(ordinalMisclassificationMatrix, orderOfDecision);
        }

        logger.debug(ordinalMisclassificationMatrixAbstractResponse.toString());
        return ordinalMisclassificationMatrixAbstractResponse;
    }

    public NamedResource download(UUID id, MisclassificationMatrixType typeOfMatrix, Integer numberOfFold) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfMatrix:\t{}", typeOfMatrix);
        if(numberOfFold != null) logger.info("NumberOfFold:\t{}", numberOfFold);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final OrdinalMisclassificationMatrix ordinalMisclassificationMatrix = extractOrdinalMisclassificationMatrixFromProject(project, typeOfMatrix, numberOfFold);

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
                filename = project.getName() + " misclassification matrix (cross-validation fold " + (numberOfFold + 1) + ").txt";
                break;

            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of misclassification matrix \"%s\" is unrecognized.", typeOfMatrix));
                logger.error(ex.getMessage());
                throw ex;
        }

        final String matrixString = ordinalMisclassificationMatrix.serialize();

        final InputStream is = new ByteArrayInputStream(matrixString.getBytes());
        final InputStreamResource resource = new InputStreamResource(is);

        return new NamedResource(filename, resource);
    }
}
