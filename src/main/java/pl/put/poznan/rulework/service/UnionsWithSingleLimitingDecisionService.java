package pl.put.poznan.rulework.service;

import org.rulelearn.approximations.*;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.InformationTableWithDecisionDistributions;
import org.rulelearn.measures.ConsistencyMeasure;
import org.rulelearn.measures.dominance.EpsilonConsistencyMeasure;
import org.rulelearn.measures.dominance.RoughMembershipMeasure;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.enums.UnionType;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.exception.WrongParameterException;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.IOException;
import java.util.UUID;

@Service
public class UnionsWithSingleLimitingDecisionService {

    private static final Logger logger = LoggerFactory.getLogger(UnionsWithSingleLimitingDecisionService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static UnionsWithSingleLimitingDecision calculateUnionsWithSingleLimitingDecision(InformationTable informationTable, UnionType typeOfUnions, Double consistencyThreshold) {
        ConsistencyMeasure<Union> consistencyMeasure = null;

        switch (typeOfUnions) {
            case MONOTONIC:
                consistencyMeasure = EpsilonConsistencyMeasure.getInstance();
                break;
            case STANDARD:
                consistencyMeasure = RoughMembershipMeasure.getInstance();
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of unions \"%s\" is unrecognized.", typeOfUnions));
                logger.error(ex.getMessage());
                throw ex;
            }

        UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = new UnionsWithSingleLimitingDecision(
                new InformationTableWithDecisionDistributions(informationTable),
                new VCDominanceBasedRoughSetCalculator(consistencyMeasure, consistencyThreshold)
        );

        return unionsWithSingleLimitingDecision;
    }

    public static void calculateUnionsWithSingleLimitingDecisionInProject(Project project, UnionType typeOfUnions, Double consistencyThreshold) {
        UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = calculateUnionsWithSingleLimitingDecision(project.getInformationTable(), typeOfUnions, consistencyThreshold);

        project.setUnionsWithSingleLimitingDecision(unionsWithSingleLimitingDecision);
        project.setTypeOfUnions(typeOfUnions);
        project.setConsistencyThreshold(consistencyThreshold);
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

    public UnionsWithSingleLimitingDecision putUnionsWithSingleLimitingDecision(UUID id, UnionType typeOfUnions, Double consistencyThreshold) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateUnionsWithSingleLimitingDecisionInProject(project, typeOfUnions, consistencyThreshold);

        return project.getUnionsWithSingleLimitingDecision();
    }

    public UnionsWithSingleLimitingDecision postUnionsWithSingleLimitingDecision(UUID id, UnionType typeOfUnions, Double consistencyThreshold, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateUnionsWithSingleLimitingDecisionInProject(project, typeOfUnions, consistencyThreshold);

        return project.getUnionsWithSingleLimitingDecision();
    }
}
