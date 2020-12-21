package pl.put.poznan.rulestudio.service;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.data.*;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.exception.*;
import pl.put.poznan.rulestudio.model.*;
import pl.put.poznan.rulestudio.model.parameters.ClassificationParameters;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.model.response.AttributeFieldsResponse.AttributeFieldsResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ChosenRuleResponse.ChosenRuleResponseBuilder;
import pl.put.poznan.rulestudio.model.response.MainClassificationResponse.MainClassificationResponseBuilder;
import pl.put.poznan.rulestudio.model.response.OrdinalMisclassificationMatrixWithoutDeviationResponse.OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder;
import pl.put.poznan.rulestudio.model.response.RuleMainPropertiesResponse.RuleMainPropertiesResponseBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class ClassificationService {

    private static final Logger logger = LoggerFactory.getLogger(ClassificationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static ProjectClassification getClassificationFromProject(Project project) {
        ProjectClassification projectClassification = project.getProjectClassification();
        if(projectClassification == null) {
            EmptyResponseException ex = new EmptyResponseException("Classification hasn't been calculated.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return projectClassification;
    }

    private static ProjectRules getRulesToClassify(Project project) {
        if(project.getProjectRules() == null) {
            NoRulesException ex = new NoRulesException("There are no rules in this project. Calculate or upload rules to classify data.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return project.getProjectRules();
    }

    private static String[] createClassifiedDescriptiveAttributesPriority(Project project) {
        ArrayList<String> classifiedDescriptiveAttributesPriorityArrayList = new ArrayList<>();
        final ProjectClassification previousProjectClassification = project.getProjectClassification();
        if (previousProjectClassification != null) {
            classifiedDescriptiveAttributesPriorityArrayList.add(previousProjectClassification.getClassifiedDescriptiveAttributes().getCurrentAttributeName());
        }
        classifiedDescriptiveAttributesPriorityArrayList.add(project.getDescriptiveAttributes().getCurrentAttributeName());
        return classifiedDescriptiveAttributesPriorityArrayList.toArray(new String[0]);
    }

    private static String[] createLearningDescriptiveAttributesPriority(Project project, ProjectRules projectRules) {
        ArrayList<String> learningDescriptiveAttributesPriorityArrayList = new ArrayList<>();
        final ProjectClassification previousProjectClassification = project.getProjectClassification();
        if (previousProjectClassification != null) {
            learningDescriptiveAttributesPriorityArrayList.add(previousProjectClassification.getLearningDescriptiveAttributes().getCurrentAttributeName());
        }
        if (projectRules.isCoveragePresent()) {
            learningDescriptiveAttributesPriorityArrayList.add(projectRules.getDescriptiveAttributes().getCurrentAttributeName());
        }
        learningDescriptiveAttributesPriorityArrayList.add(project.getDescriptiveAttributes().getCurrentAttributeName());
        return learningDescriptiveAttributesPriorityArrayList.toArray(new String[0]);
    }

    public MainClassificationResponse getClassification(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(projectClassification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse putClassification(UUID id, ClassificationParameters classificationParameters) {
        logger.info("Id:\t{}", id);
        logger.info("ClassificationParameters:\t{}", classificationParameters);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = project.getInformationTable();
        DataService.checkInformationTable(informationTable, "There is no data in project. Couldn't reclassify.");
        DataService.checkNumberOfObjects(informationTable, "There are no objects in project. Couldn't reclassify.");

        final ProjectRules projectRules = getRulesToClassify(project);

        final String[] classifiedDescriptiveAttributesPriority = createClassifiedDescriptiveAttributesPriority(project);
        final String[] learningDescriptiveAttributesPriority = createLearningDescriptiveAttributesPriority(project, projectRules);

        final ProjectClassification projectClassification = new ProjectClassification(projectRules, informationTable, classificationParameters, classifiedDescriptiveAttributesPriority, learningDescriptiveAttributesPriority, informationTable);
        project.setProjectClassification(projectClassification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(projectClassification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse putClassificationNewData(
            UUID id,
            ClassificationParameters classificationParameters,
            MultipartFile externalDataFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ClassificationParameters:\t{}", classificationParameters);
        logger.info("Data:\t{}\t{}", externalDataFile.getOriginalFilename(), externalDataFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable projectInformationTable = project.getInformationTable();
        DataService.checkInformationTable(projectInformationTable, "There is no data in project. Couldn't classify data from file.");

        final Attribute[] attributes = projectInformationTable.getAttributes();
        MetadataService.checkAttributes(attributes, "There is no metadata in project. Couldn't read classified data from file.");

        final ProjectRules projectRules = getRulesToClassify(project);

        final InformationTable newInformationTable = DataService.informationTableFromMultipartFileData(externalDataFile, attributes, separator, header);
        DataService.checkInformationTable(newInformationTable, "There is no data in external file. Couldn't classify.");
        DataService.checkNumberOfObjects(newInformationTable, "There are no objects in external data. Couldn't classify.");

        final String[] classifiedDescriptiveAttributesPriority = createClassifiedDescriptiveAttributesPriority(project);
        final String[] learningDescriptiveAttributesPriority = createLearningDescriptiveAttributesPriority(project, projectRules);

        final ProjectClassification projectClassification = new ProjectClassification(projectRules, newInformationTable, classificationParameters, classifiedDescriptiveAttributesPriority, learningDescriptiveAttributesPriority, projectInformationTable, externalDataFile.getOriginalFilename());
        project.setProjectClassification(projectClassification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(projectClassification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse postClassification(UUID id, ClassificationParameters classificationParameters, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ClassificationParameters:\t{}", classificationParameters);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        DataService.checkNumberOfObjects(informationTable, "There are no objects in project. Couldn't reclassify.");

        final ProjectRules projectRules = getRulesToClassify(project);

        final String[] classifiedDescriptiveAttributesPriority = createClassifiedDescriptiveAttributesPriority(project);
        final String[] learningDescriptiveAttributesPriority = createLearningDescriptiveAttributesPriority(project, projectRules);

        final ProjectClassification projectClassification = new ProjectClassification(projectRules, informationTable, classificationParameters, classifiedDescriptiveAttributesPriority, learningDescriptiveAttributesPriority, informationTable);
        project.setProjectClassification(projectClassification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(projectClassification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse postClassificationNewData(
            UUID id,
            ClassificationParameters classificationParameters,
            String metadata,
            String data,
            MultipartFile externalDataFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ClassificationParameters:\t{}", classificationParameters);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);
        logger.info("ExternalDataFile:\t{}\t{}", externalDataFile.getOriginalFilename(), externalDataFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable projectInformationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(projectInformationTable);

        final ProjectRules projectRules = getRulesToClassify(project);

        final InformationTable newInformationTable = DataService.informationTableFromMultipartFileData(externalDataFile, projectInformationTable.getAttributes(), separator, header);
        DataService.checkInformationTable(newInformationTable, "There is no data in external file. Couldn't classify.");
        DataService.checkNumberOfObjects(newInformationTable, "There are no objects in external data. Couldn't classify.");

        final String[] classifiedDescriptiveAttributesPriority = createClassifiedDescriptiveAttributesPriority(project);
        final String[] learningDescriptiveAttributesPriority = createLearningDescriptiveAttributesPriority(project, projectRules);

        final ProjectClassification projectClassification = new ProjectClassification(projectRules, newInformationTable, classificationParameters, classifiedDescriptiveAttributesPriority, learningDescriptiveAttributesPriority, projectInformationTable, externalDataFile.getOriginalFilename());
        project.setProjectClassification(projectClassification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(projectClassification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public DescriptiveAttributesResponse getDescriptiveAttributes(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse(projectClassification.getClassifiedDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public DescriptiveAttributesResponse postDescriptiveAttributes(UUID id, String objectVisibleName) {
        logger.info("Id:\t{}", id);
        logger.info("ObjectVisibleName:\t{}", objectVisibleName);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        DescriptiveAttributes classifiedDescriptiveAttributes = projectClassification.getClassifiedDescriptiveAttributes();
        classifiedDescriptiveAttributes.setCurrentAttribute(objectVisibleName);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse(projectClassification.getClassifiedDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final Integer descriptiveAttributeIndex = projectClassification.getClassifiedDescriptiveAttributes().getCurrentAttributeInformationTableIndex();
        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().build(projectClassification.getClassifiedInformationTable(), descriptiveAttributeIndex);
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public ChosenClassifiedObjectAbstractResponse getChosenClassifiedObject(UUID id, Integer objectIndex, Boolean isAttributes) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ClassifiedObjectIndex:\t{}", objectIndex);
        logger.info("IsAttributes:\t{}", isAttributes);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final InformationTable informationTable = projectClassification.getClassifiedInformationTable();
        if((objectIndex < 0) || (objectIndex >= informationTable.getNumberOfObjects())) {
            WrongParameterException ex = new WrongParameterException(String.format("Given object's index \"%d\" is incorrect. You can choose object from %d to %d", objectIndex, 0, informationTable.getNumberOfObjects() - 1));
            logger.error(ex.getMessage());
            throw ex;
        }
        final IntList indicesOfCoveringRules = projectClassification.getIndicesOfCoveringRules()[objectIndex];

        ChosenClassifiedObjectAbstractResponse chosenClassifiedObjectAbstractResponse;
        if(isAttributes) {
            chosenClassifiedObjectAbstractResponse = new ChosenClassifiedObjectWithAttributesResponse(informationTable, objectIndex, indicesOfCoveringRules);
        } else {
            chosenClassifiedObjectAbstractResponse = new ChosenClassifiedObjectResponse(informationTable, objectIndex, indicesOfCoveringRules);
        }
        logger.debug("chosenClassifiedObjectAbstractResponse:\t{}", chosenClassifiedObjectAbstractResponse);
        return chosenClassifiedObjectAbstractResponse;
    }

    public RuleMainPropertiesResponse getRule(UUID id, Integer ruleIndex) {
        logger.info("Id:\t{}", id);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = projectClassification.getRuleSet();

        final RuleMainPropertiesResponse ruleMainPropertiesResponse = RuleMainPropertiesResponseBuilder.newInstance().build(ruleSetWithCharacteristics, ruleIndex);
        logger.debug("ruleMainPropertiesResponse:\t{}", ruleMainPropertiesResponse);
        return ruleMainPropertiesResponse;
    }

    public DescriptiveAttributesResponse getRulesDescriptiveAttributes(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse(projectClassification.getLearningDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public DescriptiveAttributesResponse postRulesDescriptiveAttributes(UUID id, String objectVisibleName) {
        logger.info("Id:\t{}", id);
        logger.info("ObjectVisibleName:\t{}", objectVisibleName);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        DescriptiveAttributes learningDescriptiveAttributes = projectClassification.getLearningDescriptiveAttributes();
        learningDescriptiveAttributes.setCurrentAttribute(objectVisibleName);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse(projectClassification.getLearningDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public AttributeFieldsResponse getRulesObjectNames(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final Integer descriptiveAttributeIndex = projectClassification.getLearningDescriptiveAttributes().getCurrentAttributeInformationTableIndex();
        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().build(projectClassification.getLearningInformationTable(), descriptiveAttributeIndex);
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public AttributeFieldsResponse getRulesObjectNames(UUID id, Integer ruleIndex) {
        logger.info("Id:\t{}", id);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        RuleSetWithCharacteristics ruleSetWithCharacteristics = projectClassification.getRuleSet();
        final int[] indices = RulesService.getCoveringObjectsIndices(ruleSetWithCharacteristics, ruleIndex);
        final String[] objectNames = projectClassification.getLearningDescriptiveAttributes().extractChosenObjectNames(projectClassification.getLearningInformationTable(), indices);

        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().setFields(objectNames).build();
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public ChosenRuleResponse getRuleCoveringObjects(UUID id, Integer ruleIndex) {
        logger.info("Id:\t{}", id);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final ChosenRuleResponse chosenRuleResponse = ChosenRuleResponseBuilder.newInstance().build(projectClassification.getRuleSet(), ruleIndex, projectClassification.getLearningDescriptiveAttributes(), projectClassification.getLearningInformationTable());
        logger.debug("chosenRuleResponse:\t{}", chosenRuleResponse);
        return chosenRuleResponse;
    }

    public ObjectAbstractResponse getRulesObject(UUID id, Integer objectIndex, Boolean isAttributes) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ObjectIndex:\t{}", objectIndex);
        logger.info("IsAttributes:\t{}", isAttributes);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        ObjectAbstractResponse objectAbstractResponse;
        if(isAttributes) {
            objectAbstractResponse = new ObjectWithAttributesResponse(projectClassification.getLearningInformationTable(), objectIndex);
        } else {
            objectAbstractResponse = new ObjectResponse(projectClassification.getLearningInformationTable(), objectIndex);
        }
        logger.debug("objectAbstractResponse:\t{}", objectAbstractResponse.toString());
        return objectAbstractResponse;
    }

    public OrdinalMisclassificationMatrixWithoutDeviationResponse getMisclassificationMatrix(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final OrdinalMisclassificationMatrixWithoutDeviationResponse ordinalMisclassificationMatrixWithoutDeviationResponse = OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder.newInstance().build(projectClassification.getOrdinalMisclassificationMatrix(), projectClassification.getOrderOfDecisions());
        logger.debug("ordinalMisclassificationMatrixWithoutDeviationResponse:\t{}", ordinalMisclassificationMatrixWithoutDeviationResponse.toString());
        return ordinalMisclassificationMatrixWithoutDeviationResponse;
    }
}
