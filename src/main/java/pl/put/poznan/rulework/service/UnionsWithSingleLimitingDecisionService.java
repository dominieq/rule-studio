package pl.put.poznan.rulework.service;

import org.rulelearn.approximations.*;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.InformationTableWithDecisionDistributions;
import org.rulelearn.measures.dominance.EpsilonConsistencyMeasure;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.IOException;
import java.util.UUID;

@Service
public class UnionsWithSingleLimitingDecisionService {

    private static final Logger logger = LoggerFactory.getLogger(UnionsWithSingleLimitingDecisionService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private void calculateUnionsWithSingleLimitingDecision(Project project, Double consistencyThreshold) {
        UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = new UnionsWithSingleLimitingDecision(
                new InformationTableWithDecisionDistributions(project.getInformationTable()),
                new VCDominanceBasedRoughSetCalculator(EpsilonConsistencyMeasure.getInstance(), consistencyThreshold)
        );

        project.setUnionsWithSingleLimitingDecision(unionsWithSingleLimitingDecision);
        project.setCalculatedUnionsWithSingleLimitingDecision(true);
    }

    public UnionsWithSingleLimitingDecision getUnionsWithSingleLimitingDecision(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = project.getUnionsWithSingleLimitingDecision();
        if(unionsWithSingleLimitingDecision == null) {
            EmptyResponseException ex = new EmptyResponseException("Unions", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        logger.debug("unionsWithSingleLimitingDecision:\t{}", unionsWithSingleLimitingDecision.toString());
        return unionsWithSingleLimitingDecision;
    }

    public UnionsWithSingleLimitingDecision putUnionsWithSingleLimitingDecision(UUID id, Double consistencyThreshold) {
        logger.info("Id:\t{}", id);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateUnionsWithSingleLimitingDecision(project, consistencyThreshold);

        return project.getUnionsWithSingleLimitingDecision();
    }

    public UnionsWithSingleLimitingDecision postUnionsWithSingleLimitingDecision(UUID id, Double consistencyThreshold, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateUnionsWithSingleLimitingDecision(project, consistencyThreshold);

        return project.getUnionsWithSingleLimitingDecision();
    }
}
