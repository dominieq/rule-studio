package pl.put.poznan.rulestudio.service;

import org.rulelearn.core.AttributeNotFoundException;
import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.enums.ConeType;
import pl.put.poznan.rulestudio.exception.CalculationException;
import pl.put.poznan.rulestudio.exception.EmptyResponseException;
import pl.put.poznan.rulestudio.model.*;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.model.response.AttributeFieldsResponse.AttributeFieldsResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ChosenDominanceConeResponse.ChosenDominanceConeResponseBuilder;
import pl.put.poznan.rulestudio.model.response.MainDominanceConesResponse.MainDominanceConesResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ObjectsComparisonResponse.ObjectsComparisonResponseBuilder;

import java.io.*;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class DominanceConesService {

    private static final Logger logger = LoggerFactory.getLogger(DominanceConesService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private void calculateDominanceCones(Project project) {
        final DominanceCones previousDominanceCones = project.getDominanceCones();
        if((previousDominanceCones != null) && (previousDominanceCones.isCurrentData())) {
            logger.info("Dominance cones are already calculated with given configuration, skipping current calculation.");
            return;
        }

        CalculationsStopWatch calculationsStopWatch = new CalculationsStopWatch();

        final InformationTable informationTable = project.getInformationTable();
        DataService.checkInformationTable(informationTable, "There is no data in project. Couldn't calculate dominance cones.");
        DataService.checkNumberOfObjects(informationTable, "There are no objects in project. Couldn't calculate dominance cones.");

        ArrayList<String> descriptiveAttributesPriorityArrayList = new ArrayList<>();
        if (previousDominanceCones != null) {
            descriptiveAttributesPriorityArrayList.add(previousDominanceCones.getDescriptiveAttributes().getCurrentAttributeName());
        }
        descriptiveAttributesPriorityArrayList.add(project.getDescriptiveAttributes().getCurrentAttributeName());
        final String[] descriptiveAttributesPriority = descriptiveAttributesPriorityArrayList.toArray(new String[0]);

        DominanceCones dominanceCones = new DominanceCones();
        try {
            dominanceCones.calculateDCones(informationTable, descriptiveAttributesPriority);
        } catch (AttributeNotFoundException e) {
            CalculationException ex = new CalculationException("Cannot calculate dominance cones if there are no active condition evaluation attributes.");
            logger.error(ex.getMessage());
            throw ex;
        }
        calculationsStopWatch.stop();
        dominanceCones.setCalculationsTime(calculationsStopWatch.getReadableTime());

        project.setDominanceCones(dominanceCones);
    }

    private DominanceCones getDominanceConesFromProject(Project project) {
        final DominanceCones dominanceCones = project.getDominanceCones();
        if(dominanceCones == null) {
            EmptyResponseException ex = new EmptyResponseException("Dominance cones haven't been calculated.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return dominanceCones;
    }

    public MainDominanceConesResponse getDominanceCones(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final DominanceCones dominanceCones = getDominanceConesFromProject(project);

        final MainDominanceConesResponse mainDominanceConesResponse = MainDominanceConesResponseBuilder.newInstance().build(dominanceCones);
        logger.debug(mainDominanceConesResponse.toString());
        return mainDominanceConesResponse;
    }

    public MainDominanceConesResponse putDominanceCones(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateDominanceCones(project);

        final DominanceCones dominanceCones = project.getDominanceCones();
        final MainDominanceConesResponse mainDominanceConesResponse = MainDominanceConesResponseBuilder.newInstance().build(dominanceCones);
        logger.debug(mainDominanceConesResponse.toString());
        return mainDominanceConesResponse;
    }

    public MainDominanceConesResponse postDominanceCones(UUID id, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateDominanceCones(project);

        final DominanceCones dominanceCones = project.getDominanceCones();
        final MainDominanceConesResponse mainDominanceConesResponse = MainDominanceConesResponseBuilder.newInstance().build(dominanceCones);
        logger.debug(mainDominanceConesResponse.toString());
        return mainDominanceConesResponse;
    }

    public DescriptiveAttributesResponse getDescriptiveAttributes(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final DominanceCones dominanceCones = getDominanceConesFromProject(project);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse(dominanceCones.getDescriptiveAttributes());
        logger.debug(descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public DescriptiveAttributesResponse postDescriptiveAttributes(UUID id, String objectVisibleName) {
        logger.info("Id:\t{}", id);
        logger.info("ObjectVisibleName:\t{}", objectVisibleName);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final DominanceCones dominanceCones = getDominanceConesFromProject(project);

        DescriptiveAttributes descriptiveAttributes = dominanceCones.getDescriptiveAttributes();
        descriptiveAttributes.setCurrentAttribute(objectVisibleName);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse(dominanceCones.getDescriptiveAttributes());
        logger.debug(descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final DominanceCones dominanceCones = getDominanceConesFromProject(project);

        final Integer descriptiveAttributeIndex = dominanceCones.getDescriptiveAttributes().getCurrentAttributeInformationTableIndex();
        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().build(dominanceCones.getInformationTable(), descriptiveAttributeIndex);
        logger.debug(attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public ChosenDominanceConeResponse getChosenDominanceCone(UUID id, Integer objectIndex, ConeType coneType) {
        logger.info("Id:\t{}", id);
        logger.info("ObjectIndex:\t{}", objectIndex);
        logger.info("ConeTyped:\t{}", coneType);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final DominanceCones dominanceCones = getDominanceConesFromProject(project);

        final ChosenDominanceConeResponse chosenDominanceConeResponse = ChosenDominanceConeResponseBuilder.newInstance().build(dominanceCones, objectIndex, coneType);
        logger.debug(chosenDominanceConeResponse.toString());
        return chosenDominanceConeResponse;
    }

    public ObjectAbstractResponse getObject(UUID id, Integer objectIndex, Boolean isAttributes) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ObjectIndex:\t{}", objectIndex);
        logger.info("IsAttributes:\t{}", isAttributes);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final DominanceCones dominanceCones = getDominanceConesFromProject(project);

        ObjectAbstractResponse objectAbstractResponse;
        if(isAttributes) {
            objectAbstractResponse = new ObjectWithAttributesResponse(dominanceCones.getInformationTable(), objectIndex);
        } else {
            objectAbstractResponse = new ObjectResponse(dominanceCones.getInformationTable(), objectIndex);
        }
        logger.debug(objectAbstractResponse.toString());
        return objectAbstractResponse;
    }

    public ObjectsComparisonResponse getObjectsComparison(UUID id, Integer firstObjectIndex, Integer secondObjectIndex) {
        logger.info("Id:\t" + id);
        logger.info("firstObjectIndex:\t{}", firstObjectIndex);
        logger.info("secondObjectIndex:\t{}", secondObjectIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final DominanceCones dominanceCones = getDominanceConesFromProject(project);

        final ObjectsComparisonResponse objectsComparisonResponse = ObjectsComparisonResponseBuilder.newInstance().build(dominanceCones.getInformationTable(), firstObjectIndex, secondObjectIndex);
        logger.debug(objectsComparisonResponse.toString());
        return objectsComparisonResponse;
    }
}
