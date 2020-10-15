package pl.put.poznan.rulestudio.service;

import org.rulelearn.approximations.Union;
import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.approximations.VCDominanceBasedRoughSetCalculator;
import org.rulelearn.core.InvalidSizeException;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.InformationTableWithDecisionDistributions;
import org.rulelearn.measures.ConsistencyMeasure;
import org.rulelearn.measures.dominance.EpsilonConsistencyMeasure;
import org.rulelearn.measures.dominance.RoughMembershipMeasure;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.enums.ClassUnionArrayPropertyType;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.exception.CalculationException;
import pl.put.poznan.rulestudio.exception.EmptyResponseException;
import pl.put.poznan.rulestudio.exception.NoDataException;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.DescriptiveAttributes;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;
import pl.put.poznan.rulestudio.model.UnionsWithHttpParameters;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.model.response.AttributeFieldsResponse.AttributeFieldsResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ChosenClassUnionResponse.ChosenClassUnionResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ClassUnionArrayPropertyResponse.ClassUnionArrayPropertyResponseBuilder;
import pl.put.poznan.rulestudio.model.response.DescriptiveAttributesResponse.DescriptiveAttributtesResponseBuilder;
import pl.put.poznan.rulestudio.model.response.MainClassUnionsResponse.MainClassUnionsResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ObjectResponse.ObjectResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ObjectWithAttributesResponse.ObjectWithAttributesResponseBuilder;

import java.io.IOException;
import java.util.UUID;

@Service
public class UnionsService {

    private static final Logger logger = LoggerFactory.getLogger(UnionsService.class);

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

        final InformationTableWithDecisionDistributions informationTableWithDecisionDistributions = DataService.createInformationTableWithDecisionDistributions(informationTable);

        UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = null;
        try {
            unionsWithSingleLimitingDecision = new UnionsWithSingleLimitingDecision(
                    informationTableWithDecisionDistributions,
                    new VCDominanceBasedRoughSetCalculator(consistencyMeasure, consistencyThreshold)
            );
        } catch (InvalidSizeException e) {
            CalculationException ex = new CalculationException("Cannot create unions for less than one fully-determined decision.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return unionsWithSingleLimitingDecision;
    }

    public static void calculateUnionsWithHttpParametersInProject(Project project, UnionType typeOfUnions, Double consistencyThreshold) {
        UnionsWithHttpParameters unionsWithHttpParameters = project.getUnions();
        if((!project.isCurrentUnionsWithSingleLimitingDecision()) || (unionsWithHttpParameters.getTypeOfUnions() != typeOfUnions) || (!unionsWithHttpParameters.getConsistencyThreshold().equals(consistencyThreshold))) {
            InformationTable informationTable = project.getInformationTable();
            if(informationTable == null) {
                NoDataException ex = new NoDataException("There is no data in project. Couldn't calculate unions.");
                logger.error(ex.getMessage());
                throw ex;
            }
            if(informationTable.getNumberOfObjects() == 0) {
                NoDataException ex = new NoDataException("There are no objects in project. Couldn't calculate unions.");
                logger.error(ex.getMessage());
                throw ex;
            }

            final UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = calculateUnionsWithSingleLimitingDecision(informationTable, typeOfUnions, consistencyThreshold);
            final DescriptiveAttributes descriptiveAttributes = new DescriptiveAttributes(informationTable);

            unionsWithHttpParameters = new UnionsWithHttpParameters(unionsWithSingleLimitingDecision, typeOfUnions, consistencyThreshold, informationTable.getHash(), descriptiveAttributes);

            project.setUnions(unionsWithHttpParameters);
            project.setCurrentUnionsWithSingleLimitingDecision(true);
        } else {
            logger.info("Unions are already calculated with given configuration, skipping current calculation.");
        }
    }

    private UnionsWithHttpParameters getUnionsWithHttpParametersFromProject(Project project) {
        final UnionsWithHttpParameters unionsWithHttpParameters = project.getUnions();
        if(unionsWithHttpParameters == null) {
            EmptyResponseException ex = new EmptyResponseException("Unions haven't been calculated.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return unionsWithHttpParameters;
    }

    public MainClassUnionsResponse getUnions(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final UnionsWithHttpParameters unionsWithHttpParameters = getUnionsWithHttpParametersFromProject(project);

        final MainClassUnionsResponse mainClassUnionsResponse = MainClassUnionsResponseBuilder.newInstance().build(unionsWithHttpParameters);
        logger.debug("mainClassUnionsResponse:\t{}", mainClassUnionsResponse.toString());
        return mainClassUnionsResponse;
    }

    public MainClassUnionsResponse putUnions(UUID id, UnionType typeOfUnions, Double consistencyThreshold) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateUnionsWithHttpParametersInProject(project, typeOfUnions, consistencyThreshold);

        final UnionsWithHttpParameters unionsWithHttpParameters = project.getUnions();
        final MainClassUnionsResponse mainClassUnionsResponse = MainClassUnionsResponseBuilder.newInstance().build(unionsWithHttpParameters);
        logger.debug("mainClassUnionsResponse:\t{}", mainClassUnionsResponse.toString());
        return mainClassUnionsResponse;
    }

    public MainClassUnionsResponse postUnions(UUID id, UnionType typeOfUnions, Double consistencyThreshold, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateUnionsWithHttpParametersInProject(project, typeOfUnions, consistencyThreshold);

        final UnionsWithHttpParameters unionsWithHttpParameters = project.getUnions();
        final MainClassUnionsResponse mainClassUnionsResponse = MainClassUnionsResponseBuilder.newInstance().build(unionsWithHttpParameters);
        logger.debug("mainClassUnionsResponse:\t{}", mainClassUnionsResponse.toString());
        return mainClassUnionsResponse;
    }

    public DescriptiveAttributesResponse getDescriptiveAttributes(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final UnionsWithHttpParameters unionsWithHttpParameters = getUnionsWithHttpParametersFromProject(project);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = DescriptiveAttributtesResponseBuilder.newInstance().build(unionsWithHttpParameters.getDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public DescriptiveAttributesResponse postDescriptiveAttributes(UUID id, String objectVisibleName) {
        logger.info("Id:\t{}", id);
        logger.info("ObjectVisibleName:\t{}", objectVisibleName);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final UnionsWithHttpParameters unionsWithHttpParameters = getUnionsWithHttpParametersFromProject(project);

        DescriptiveAttributes descriptiveAttributes = unionsWithHttpParameters.getDescriptiveAttributes();
        descriptiveAttributes.setCurrentAttribute(objectVisibleName);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = DescriptiveAttributtesResponseBuilder.newInstance().build(unionsWithHttpParameters.getDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final UnionsWithHttpParameters unionsWithHttpParameters = getUnionsWithHttpParametersFromProject(project);

        final Integer descriptiveAttributeIndex = unionsWithHttpParameters.getDescriptiveAttributes().getCurrentAttributeInformationTableIndex();
        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().build(project.getInformationTable(), descriptiveAttributeIndex);
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    private Union getClassUnionByIndex(UnionsWithHttpParameters unionsWithHttpParameters, Integer classUnionIndex) {
        final Union[] upwardUnions, downwardUnions;
        upwardUnions = unionsWithHttpParameters.getUnions().getUpwardUnions();
        downwardUnions = unionsWithHttpParameters.getUnions().getDownwardUnions();
        final int numberOfUnions = upwardUnions.length + downwardUnions.length;
        if((classUnionIndex < 0) || (classUnionIndex >= numberOfUnions)) {
            WrongParameterException ex = new WrongParameterException(String.format("Given class union's index \"%d\" is incorrect. You can choose unions from %d to %d", classUnionIndex, 0, numberOfUnions - 1));
            logger.error(ex.getMessage());
            throw ex;
        }

        final Union chosenClassUnion;
        if(classUnionIndex < upwardUnions.length) {
            chosenClassUnion = upwardUnions[classUnionIndex];
        } else {
            chosenClassUnion = downwardUnions[classUnionIndex - upwardUnions.length];
        }

        return chosenClassUnion;
    }

    public ChosenClassUnionResponse getChosenClassUnion(UUID id, Integer classUnionIndex) {
        logger.info("Id:\t{}", id);
        logger.info("ClassUnionIndex:\t{}", classUnionIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final UnionsWithHttpParameters unionsWithHttpParameters = getUnionsWithHttpParametersFromProject(project);

        final Union chosenClassUnion = getClassUnionByIndex(unionsWithHttpParameters, classUnionIndex);

        final ChosenClassUnionResponse chosenClassUnionResponse = ChosenClassUnionResponseBuilder.newInstance().build(chosenClassUnion);
        logger.debug("chosenClassUnionResponse:\t{}", chosenClassUnionResponse.toString());
        return chosenClassUnionResponse;
    }

    public ClassUnionArrayPropertyResponse getClassUnionArrayProperty(UUID id, Integer classUnionIndex, ClassUnionArrayPropertyType classUnionArrayPropertyType) {
        logger.info("Id:\t{}", id);
        logger.info("ClassUnionIndex:\t{}", classUnionIndex);
        logger.info("ClassUnionArrayPropertyType:\t{}", classUnionArrayPropertyType);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final UnionsWithHttpParameters unionsWithHttpParameters = getUnionsWithHttpParametersFromProject(project);

        final Union chosenClassUnion = getClassUnionByIndex(unionsWithHttpParameters, classUnionIndex);

        final ClassUnionArrayPropertyResponse classUnionArrayPropertyResponse = ClassUnionArrayPropertyResponseBuilder.newInstance().build(chosenClassUnion, classUnionArrayPropertyType, unionsWithHttpParameters.getDescriptiveAttributes(), project.getInformationTable());
        logger.debug("classUnionArrayPropertyResponse:\t{}", classUnionArrayPropertyResponse.toString());
        return classUnionArrayPropertyResponse;
    }

    public ObjectAbstractResponse getObject(UUID id, Integer objectIndex, Boolean isAttributes) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ObjectIndex:\t{}", objectIndex);
        logger.info("IsAttributes:\t{}", isAttributes);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        getUnionsWithHttpParametersFromProject(project);

        ObjectAbstractResponse objectAbstractResponse;
        if(isAttributes) {
            objectAbstractResponse = ObjectWithAttributesResponseBuilder.newInstance().build(project.getInformationTable(), objectIndex);
        } else {
            objectAbstractResponse = ObjectResponseBuilder.newInstance().build(project.getInformationTable(), objectIndex);
        }
        logger.debug("objectAbstractResponse:\t{}", objectAbstractResponse.toString());
        return objectAbstractResponse;
    }
}
