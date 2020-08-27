package pl.put.poznan.rulestudio.service;

import org.rulelearn.core.AttributeNotFoundException;
import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.exception.CalculationException;
import pl.put.poznan.rulestudio.exception.EmptyResponseException;
import pl.put.poznan.rulestudio.exception.NoDataException;
import pl.put.poznan.rulestudio.model.DominanceCones;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;
import pl.put.poznan.rulestudio.model.response.MainDominanceConesResponse;
import pl.put.poznan.rulestudio.model.response.MainDominanceConesResponse.MainDominanceConesResponseBuilder;

import java.io.*;
import java.util.UUID;

@Service
public class DominanceConesService {

    private static final Logger logger = LoggerFactory.getLogger(DominanceConesService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private void calculateDominanceCones(Project project) {
        if(!project.isCurrentDominanceCones()) {
            InformationTable informationTable = project.getInformationTable();
            if(informationTable == null) {
                NoDataException ex = new NoDataException("There is no data in project. Couldn't calculate dominance cones.");
                logger.error(ex.getMessage());
                throw ex;
            }
            if(informationTable.getNumberOfObjects() == 0) {
                NoDataException ex = new NoDataException("There are no objects in project. Couldn't calculate dominance cones.");
                logger.error(ex.getMessage());
                throw ex;
            }

            DominanceCones dominanceCones = new DominanceCones();
            try {
                dominanceCones.calculateDCones(informationTable);
            } catch (AttributeNotFoundException e) {
                CalculationException ex = new CalculationException("Cannot calculate dominance cones if there are no active condition evaluation attributes.");
                logger.error(ex.getMessage());
                throw ex;
            }

            project.setDominanceCones(dominanceCones);
            project.setCurrentDominanceCones(true);
        } else {
            logger.info("Dominance cones are already calculated with given configuration, skipping current calculation.");
        }
    }

    public MainDominanceConesResponse getDominanceCones(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        DominanceCones dominanceCones = project.getDominanceCones();
        if(dominanceCones == null) {
            EmptyResponseException ex = new EmptyResponseException("Dominance cones haven't been calculated.");
            logger.error(ex.getMessage());
            throw ex;
        }

        MainDominanceConesResponse mainDominanceConesResponse = MainDominanceConesResponseBuilder.newInstance().build(dominanceCones);
        logger.debug("mainDominanceConesResponse:\t{}", mainDominanceConesResponse.toString());
        return mainDominanceConesResponse;
    }

    public MainDominanceConesResponse putDominanceCones(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateDominanceCones(project);

        DominanceCones dominanceCones = project.getDominanceCones();
        MainDominanceConesResponse mainDominanceConesResponse = MainDominanceConesResponseBuilder.newInstance().build(dominanceCones);
        logger.debug("mainDominanceConesResponse:\t{}", mainDominanceConesResponse.toString());
        return mainDominanceConesResponse;
    }

    public MainDominanceConesResponse postDominanceCones(UUID id, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateDominanceCones(project);

        DominanceCones dominanceCones = project.getDominanceCones();
        MainDominanceConesResponse mainDominanceConesResponse = MainDominanceConesResponseBuilder.newInstance().build(dominanceCones);
        logger.debug("mainDominanceConesResponse:\t{}", mainDominanceConesResponse.toString());
        return mainDominanceConesResponse;
    }
}
