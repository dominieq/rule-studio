package pl.put.poznan.rulestudio.service;

import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.exception.EmptyResponseException;
import pl.put.poznan.rulestudio.exception.NoDataException;
import pl.put.poznan.rulestudio.model.DominanceCones;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;

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
            dominanceCones.calculateDCones(informationTable);

            project.setDominanceCones(dominanceCones);
            project.setCurrentDominanceCones(true);
        } else {
            logger.info("Dominance cones are already calculated with given configuration, skipping current calculation.");
        }
    }

    public DominanceCones getDominanceCones(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        DominanceCones dominanceCones = project.getDominanceCones();
        if(dominanceCones == null) {
            EmptyResponseException ex = new EmptyResponseException("Dominance cones haven't been calculated.");
            logger.error(ex.getMessage());
            throw ex;
        }

        logger.debug("dominanceCones:\t{}", dominanceCones.toString());
        return dominanceCones;
    }

    public DominanceCones putDominanceCones(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateDominanceCones(project);

        logger.debug("dominanceCones:\t{}", project.getDominanceCones().toString());
        return project.getDominanceCones();
    }

    public DominanceCones postDominanceCones(UUID id, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateDominanceCones(project);

        logger.debug("dominanceCones:\t{}", project.getDominanceCones().toString());
        return project.getDominanceCones();
    }
}
