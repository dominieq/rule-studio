package pl.put.poznan.rulework.service;

import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.model.DominanceCones;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.*;
import java.util.UUID;

@Service
public class DominanceConesService {

    private static final Logger logger = LoggerFactory.getLogger(DominanceConesService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private void calculateDominanceCones(Project project, InformationTable informationTable) {
        DominanceCones dominanceCones = new DominanceCones();
        dominanceCones.calculateDCones(informationTable);
        project.setDominanceCones(dominanceCones);
        project.setCalculatedDominanceCones(true);
    }

    public DominanceCones getDominanceCones(UUID id) {
        logger.info("Id:\t" + id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        if(project.getDominanceCones() == null) {
            EmptyResponseException ex = new EmptyResponseException("Dominance cones", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        logger.info(project.getDominanceCones().toString());

        return project.getDominanceCones();
    }

    public DominanceCones putDominanceCones(UUID id) {
        logger.info("Id:\t" + id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateDominanceCones(project, project.getInformationTable());

        logger.info(project.getDominanceCones().toString());

        return project.getDominanceCones();
    }

    public DominanceCones postDominanceCones(UUID id, String metadata, String data) throws IOException {
        logger.info("Id:\t" + id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateDominanceCones(project, informationTable);

        logger.info(project.getDominanceCones().toString());

        return project.getDominanceCones();
    }
}
