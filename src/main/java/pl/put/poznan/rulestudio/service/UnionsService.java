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
import pl.put.poznan.rulestudio.exception.CalculationException;
import pl.put.poznan.rulestudio.exception.EmptyResponseException;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.*;
import pl.put.poznan.rulestudio.model.parameters.ClassUnionsParameters;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.model.response.AttributeFieldsResponse.AttributeFieldsResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ChosenClassUnionResponse.ChosenClassUnionResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ClassUnionArrayPropertyResponse.ClassUnionArrayPropertyResponseBuilder;
import pl.put.poznan.rulestudio.model.response.MainClassUnionsResponse.MainClassUnionsResponseBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.UUID;

@Service
public class UnionsService {

    private static final Logger logger = LoggerFactory.getLogger(UnionsService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static UnionsWithSingleLimitingDecision calculateUnionsWithSingleLimitingDecision(InformationTable informationTable, ClassUnionsParameters classUnionsParameters) {
        ConsistencyMeasure<Union> consistencyMeasure = null;

        switch (classUnionsParameters.getTypeOfUnions()) {
            case MONOTONIC:
                consistencyMeasure = EpsilonConsistencyMeasure.getInstance();
                break;
            case STANDARD:
                consistencyMeasure = RoughMembershipMeasure.getInstance();
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of unions \"%s\" is unrecognized.", classUnionsParameters.getTypeOfUnions()));
                logger.error(ex.getMessage());
                throw ex;
        }

        final InformationTableWithDecisionDistributions informationTableWithDecisionDistributions = DataService.createInformationTableWithDecisionDistributions(informationTable);

        UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = null;
        try {
            unionsWithSingleLimitingDecision = new UnionsWithSingleLimitingDecision(
                    informationTableWithDecisionDistributions,
                    new VCDominanceBasedRoughSetCalculator(consistencyMeasure, classUnionsParameters.getConsistencyThreshold())
            );
        } catch (InvalidSizeException e) {
            CalculationException ex = new CalculationException("Cannot create unions for less than one fully-determined decision.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return unionsWithSingleLimitingDecision;
    }

    public static void calculateClassUnionsInProject(Project project, ClassUnionsParameters classUnionsParameters) {
        final ProjectClassUnions previousProjectClassUnions = project.getProjectClassUnions();
        if((previousProjectClassUnions != null) && (previousProjectClassUnions.isCurrentData()) && (previousProjectClassUnions.getClassUnionsParameters().equalsTo(classUnionsParameters))) {
            logger.info("Unions are already calculated with given configuration, skipping current calculation.");
            return;
        }

        CalculationsStopWatch calculationsStopWatch = new CalculationsStopWatch();

        InformationTable informationTable = project.getInformationTable();
        DataService.checkInformationTable(informationTable, "There is no data in project. Couldn't calculate unions.");
        DataService.checkNumberOfObjects(informationTable, "There are no objects in project. Couldn't calculate unions.");

        final UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = calculateUnionsWithSingleLimitingDecision(informationTable, classUnionsParameters);

        ArrayList<String> descriptiveAttributesPriorityArrayList = new ArrayList<>();
        if (previousProjectClassUnions != null) {
            descriptiveAttributesPriorityArrayList.add(previousProjectClassUnions.getDescriptiveAttributes().getCurrentAttributeName());
        }
        descriptiveAttributesPriorityArrayList.add(project.getDescriptiveAttributes().getCurrentAttributeName());
        final String[] descriptiveAttributesPriority = descriptiveAttributesPriorityArrayList.toArray(new String[0]);

        ProjectClassUnions newProjectClassUnions = new ProjectClassUnions(unionsWithSingleLimitingDecision, classUnionsParameters, informationTable.getHash(), descriptiveAttributesPriority, informationTable);
        calculationsStopWatch.stop();
        newProjectClassUnions.setCalculationsTime(calculationsStopWatch.getReadableTime());

        project.setProjectClassUnions(newProjectClassUnions);
    }

    public static int[] getClassUnionArrayPropertyValues(Union union, ClassUnionArrayPropertyType classUnionArrayPropertyType) {
        int[] values;

        switch (classUnionArrayPropertyType) {
            case OBJECTS:
                values = union.getObjects().toIntArray();
                break;
            case LOWER_APPROXIMATION:
                values = union.getLowerApproximation().toIntArray();
                break;
            case UPPER_APPROXIMATION:
                values = union.getUpperApproximation().toIntArray();
                break;
            case BOUNDARY:
                values = union.getBoundary().toIntArray();
                break;
            case POSITIVE_REGION:
                values = union.getPositiveRegion().toIntArray();
                Arrays.sort(values);
                break;
            case NEGATIVE_REGION:
                values = union.getNegativeRegion().toIntArray();
                Arrays.sort(values);
                break;
            case BOUNDARY_REGION:
                values = union.getBoundaryRegion().toIntArray();
                Arrays.sort(values);
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of class union array property \"%s\" is unrecognized.", classUnionArrayPropertyType));
                logger.error(ex.getMessage());
                throw ex;
        }

        return values;
    }

    private ProjectClassUnions getClassUnionsFromProject(Project project) {
        final ProjectClassUnions projectClassUnions = project.getProjectClassUnions();
        if(projectClassUnions == null) {
            EmptyResponseException ex = new EmptyResponseException("Unions haven't been calculated.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return projectClassUnions;
    }

    public MainClassUnionsResponse getUnions(UUID id) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassUnions projectClassUnions = getClassUnionsFromProject(project);

        final MainClassUnionsResponse mainClassUnionsResponse = MainClassUnionsResponseBuilder.newInstance().build(projectClassUnions);
        logger.debug(mainClassUnionsResponse.toString());
        return mainClassUnionsResponse;
    }

    public MainClassUnionsResponse putUnions(UUID id, ClassUnionsParameters classUnionsParameters) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append(classUnionsParameters);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateClassUnionsInProject(project, classUnionsParameters);

        final ProjectClassUnions projectClassUnions = project.getProjectClassUnions();
        final MainClassUnionsResponse mainClassUnionsResponse = MainClassUnionsResponseBuilder.newInstance().build(projectClassUnions);
        logger.debug(mainClassUnionsResponse.toString());
        return mainClassUnionsResponse;
    }

    public MainClassUnionsResponse postUnions(UUID id, ClassUnionsParameters classUnionsParameters, String metadata, String data) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append(classUnionsParameters).append(", ");
            sb.append("metadataSize=").append(metadata.length()).append("B, ");
            if (logger.isDebugEnabled()) sb.append("metadata=").append(metadata).append(", ");
            sb.append("dataSize=").append(data.length()).append('B');
            if (logger.isDebugEnabled()) sb.append(", ").append("data=").append(data);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateClassUnionsInProject(project, classUnionsParameters);

        final ProjectClassUnions projectClassUnions = project.getProjectClassUnions();
        final MainClassUnionsResponse mainClassUnionsResponse = MainClassUnionsResponseBuilder.newInstance().build(projectClassUnions);
        logger.debug(mainClassUnionsResponse.toString());
        return mainClassUnionsResponse;
    }

    public DescriptiveAttributesResponse getDescriptiveAttributes(UUID id) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassUnions projectClassUnions = getClassUnionsFromProject(project);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse(projectClassUnions.getDescriptiveAttributes());
        logger.debug(descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public DescriptiveAttributesResponse postDescriptiveAttributes(UUID id, String objectVisibleName) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("objectVisibleName=\"").append(objectVisibleName).append('\"');
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassUnions projectClassUnions = getClassUnionsFromProject(project);

        DescriptiveAttributes descriptiveAttributes = projectClassUnions.getDescriptiveAttributes();
        descriptiveAttributes.setCurrentAttribute(objectVisibleName);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse(projectClassUnions.getDescriptiveAttributes());
        logger.debug(descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassUnions projectClassUnions = getClassUnionsFromProject(project);

        final Integer descriptiveAttributeIndex = projectClassUnions.getDescriptiveAttributes().getCurrentAttributeInformationTableIndex();
        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().build(projectClassUnions.getInformationTable(), descriptiveAttributeIndex);
        logger.debug(attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id, Integer classUnionIndex, ClassUnionArrayPropertyType classUnionArrayPropertyType) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("classUnionIndex=").append(classUnionIndex).append(", ");
            sb.append("classUnionArrayPropertyType=").append(classUnionArrayPropertyType);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassUnions projectClassUnions = getClassUnionsFromProject(project);

        final Union chosenClassUnion = getClassUnionByIndex(projectClassUnions, classUnionIndex);
        final int[] indices =  getClassUnionArrayPropertyValues(chosenClassUnion, classUnionArrayPropertyType);
        final String[] objectNames = projectClassUnions.getDescriptiveAttributes().extractChosenObjectNames(projectClassUnions.getInformationTable(), indices);

        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().setFields(objectNames).build();
        logger.debug(attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    private Union getClassUnionByIndex(ProjectClassUnions projectClassUnions, Integer classUnionIndex) {
        final Union[] upwardUnions, downwardUnions;
        upwardUnions = projectClassUnions.getUnions().getUpwardUnions();
        downwardUnions = projectClassUnions.getUnions().getDownwardUnions();
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
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("classUnionIndex=").append(classUnionIndex);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassUnions projectClassUnions = getClassUnionsFromProject(project);

        final Union chosenClassUnion = getClassUnionByIndex(projectClassUnions, classUnionIndex);

        final ChosenClassUnionResponse chosenClassUnionResponse = ChosenClassUnionResponseBuilder.newInstance().build(chosenClassUnion);
        logger.debug(chosenClassUnionResponse.toString());
        return chosenClassUnionResponse;
    }

    public ClassUnionArrayPropertyResponse getClassUnionArrayProperty(UUID id, Integer classUnionIndex, ClassUnionArrayPropertyType classUnionArrayPropertyType) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("classUnionIndex=").append(classUnionIndex).append(", ");
            sb.append("classUnionArrayPropertyType=").append(classUnionArrayPropertyType);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassUnions projectClassUnions = getClassUnionsFromProject(project);

        final Union chosenClassUnion = getClassUnionByIndex(projectClassUnions, classUnionIndex);

        final ClassUnionArrayPropertyResponse classUnionArrayPropertyResponse = ClassUnionArrayPropertyResponseBuilder.newInstance().build(chosenClassUnion, classUnionArrayPropertyType, projectClassUnions.getDescriptiveAttributes(), projectClassUnions.getInformationTable());
        logger.debug(classUnionArrayPropertyResponse.toString());
        return classUnionArrayPropertyResponse;
    }

    public ObjectAbstractResponse getObject(UUID id, Integer objectIndex, Boolean isAttributes) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("objectIndex=").append(objectIndex).append(", ");
            sb.append("isAttributes=").append(isAttributes);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassUnions projectClassUnions = getClassUnionsFromProject(project);

        ObjectAbstractResponse objectAbstractResponse;
        if(isAttributes) {
            objectAbstractResponse = new ObjectWithAttributesResponse(projectClassUnions.getInformationTable(), objectIndex);
        } else {
            objectAbstractResponse = new ObjectResponse(projectClassUnions.getInformationTable(), objectIndex);
        }
        logger.debug(objectAbstractResponse.toString());
        return objectAbstractResponse;
    }
}
