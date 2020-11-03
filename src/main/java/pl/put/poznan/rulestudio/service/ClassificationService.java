package pl.put.poznan.rulestudio.service;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.data.*;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.exception.*;
import pl.put.poznan.rulestudio.model.*;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.model.response.AttributeFieldsResponse.AttributeFieldsResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ChosenRuleResponse.ChosenRuleResponseBuilder;
import pl.put.poznan.rulestudio.model.response.DescriptiveAttributesResponse.DescriptiveAttributtesResponseBuilder;
import pl.put.poznan.rulestudio.model.response.MainClassificationResponse.MainClassificationResponseBuilder;
import pl.put.poznan.rulestudio.model.response.OrdinalMisclassificationMatrixWithoutDeviationResponse.OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder;
import pl.put.poznan.rulestudio.model.response.RuleMainPropertiesResponse.RuleMainPropertiesResponseBuilder;

import java.io.IOException;
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

    private static void checkInformationTable(InformationTable informationTable, String message) {
        if(informationTable == null) {
            NoDataException ex = new NoDataException(message);
            logger.error(ex.getMessage());
            throw ex;
        }
    }

    private static void checkNumberOfClassifiedObjects(int numberOfObjects, String message) {
        if(numberOfObjects == 0) {
            NoDataException ex = new NoDataException(message);
            logger.error(ex.getMessage());
            throw ex;
        }
    }

    private static RuleSetWithCharacteristics getRuleSetToClassify(Project project) {
        if(project.getRules() == null) {
            NoRulesException ex = new NoRulesException("There are no rules in this project. Calculate or upload rules to classify data.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return project.getRules().getRuleSet();
    }

    public MainClassificationResponse getClassification(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(projectClassification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse putClassification(UUID id, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = project.getInformationTable();
        checkInformationTable(informationTable, "There is no data in project. Couldn't reclassify.");

        checkNumberOfClassifiedObjects(informationTable.getNumberOfObjects(), "There are no objects in project. Couldn't reclassify.");

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = getRuleSetToClassify(project);

        final ProjectClassification projectClassification = new ProjectClassification(informationTable, informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics);
        project.setProjectClassification(projectClassification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(projectClassification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse putClassificationNewData(
            UUID id,
            ClassifierType typeOfClassifier,
            DefaultClassificationResultType defaultClassificationResult,
            MultipartFile externalDataFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("Data:\t{}\t{}", externalDataFile.getOriginalFilename(), externalDataFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable projectInformationTable = project.getInformationTable();
        checkInformationTable(projectInformationTable, "There is no data in project. Couldn't classify data from file.");

        final Attribute[] attributes = projectInformationTable.getAttributes();
        if(attributes == null) {
            NoDataException ex = new NoDataException("There is no metadata in project. Couldn't read classified data from file.");
            logger.error(ex.getMessage());
            throw ex;
        }

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = getRuleSetToClassify(project);

        final InformationTable newInformationTable = DataService.informationTableFromMultipartFileData(externalDataFile, attributes, separator, header);
        checkInformationTable(newInformationTable, "There is no data in external file. Couldn't classify.");
        checkNumberOfClassifiedObjects(newInformationTable.getNumberOfObjects(), "There are no objects in external data. Couldn't classify.");

        final ProjectClassification projectClassification = new ProjectClassification(projectInformationTable, newInformationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, externalDataFile.getOriginalFilename());
        project.setProjectClassification(projectClassification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(projectClassification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse postClassification(UUID id, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        checkNumberOfClassifiedObjects(informationTable.getNumberOfObjects(), "There are no objects in project. Couldn't reclassify.");

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = getRuleSetToClassify(project);

        final ProjectClassification projectClassification = new ProjectClassification(informationTable, informationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics);
        project.setProjectClassification(projectClassification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(projectClassification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public MainClassificationResponse postClassificationNewData(
            UUID id,
            ClassifierType typeOfClassifier,
            DefaultClassificationResultType defaultClassificationResult,
            String metadata,
            String data,
            MultipartFile externalDataFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);
        logger.info("ExternalDataFile:\t{}\t{}", externalDataFile.getOriginalFilename(), externalDataFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable projectInformationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(projectInformationTable);

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = getRuleSetToClassify(project);

        final InformationTable newInformationTable = DataService.informationTableFromMultipartFileData(externalDataFile, projectInformationTable.getAttributes(), separator, header);
        checkInformationTable(newInformationTable, "There is no data in external file. Couldn't classify.");
        checkNumberOfClassifiedObjects(newInformationTable.getNumberOfObjects(), "There are no objects in external data. Couldn't classify.");

        final ProjectClassification projectClassification = new ProjectClassification(projectInformationTable, newInformationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, externalDataFile.getOriginalFilename());
        project.setProjectClassification(projectClassification);

        final MainClassificationResponse mainClassificationResponse = MainClassificationResponseBuilder.newInstance().build(projectClassification);
        logger.debug("mainClassificationResponse:\t{}", mainClassificationResponse);
        return mainClassificationResponse;
    }

    public DescriptiveAttributesResponse getDescriptiveAttributes(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = DescriptiveAttributtesResponseBuilder.newInstance().build(projectClassification.getDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public DescriptiveAttributesResponse postDescriptiveAttributes(UUID id, String objectVisibleName) {
        logger.info("Id:\t{}", id);
        logger.info("ObjectVisibleName:\t{}", objectVisibleName);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        DescriptiveAttributes descriptiveAttributes = projectClassification.getDescriptiveAttributes();
        descriptiveAttributes.setCurrentAttribute(objectVisibleName);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = DescriptiveAttributtesResponseBuilder.newInstance().build(projectClassification.getDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final Integer descriptiveAttributeIndex = projectClassification.getDescriptiveAttributes().getCurrentAttributeInformationTableIndex();
        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().build(project.getInformationTable(), descriptiveAttributeIndex);
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

        getClassificationFromProject(project);

        final RuleMainPropertiesResponse ruleMainPropertiesResponse = RuleMainPropertiesResponseBuilder.newInstance().build(project.getRules().getRuleSet(), ruleIndex);
        logger.debug("ruleMainPropertiesResponse:\t{}", ruleMainPropertiesResponse);
        return ruleMainPropertiesResponse;
    }

    public DescriptiveAttributesResponse getRulesDescriptiveAttributes(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = DescriptiveAttributtesResponseBuilder.newInstance().build(projectClassification.getRulesDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public DescriptiveAttributesResponse postRulesDescriptiveAttributes(UUID id, String objectVisibleName) {
        logger.info("Id:\t{}", id);
        logger.info("ObjectVisibleName:\t{}", objectVisibleName);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        DescriptiveAttributes rulesDescriptiveAttributes = projectClassification.getRulesDescriptiveAttributes();
        rulesDescriptiveAttributes.setCurrentAttribute(objectVisibleName);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = DescriptiveAttributtesResponseBuilder.newInstance().build(projectClassification.getRulesDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public AttributeFieldsResponse getRulesObjectNames(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final Integer descriptiveAttributeIndex = projectClassification.getRulesDescriptiveAttributes().getCurrentAttributeInformationTableIndex();
        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().build(project.getInformationTable(), descriptiveAttributeIndex);
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public AttributeFieldsResponse getRulesObjectNames(UUID id, Integer ruleIndex) {
        logger.info("Id:\t{}", id);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        RulesWithHttpParameters rulesWithHttpParameters = RulesService.getRulesFromProject(project);
        final int[] indices = RulesService.getCoveringObjectsIndices(rulesWithHttpParameters.getRuleSet(), ruleIndex);
        String[] objectNames = projectClassification.getRulesDescriptiveAttributes().extractChosenObjectNames(project.getInformationTable(), indices);

        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().setFields(objectNames).build();
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public ChosenRuleResponse getRuleCoveringObjects(UUID id, Integer ruleIndex) {
        logger.info("Id:\t{}", id);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final ProjectClassification projectClassification = getClassificationFromProject(project);

        final ChosenRuleResponse chosenRuleResponse = ChosenRuleResponseBuilder.newInstance().build(project.getRules().getRuleSet(), ruleIndex, projectClassification.getRulesDescriptiveAttributes(), project.getInformationTable());
        logger.debug("chosenRuleResponse:\t{}", chosenRuleResponse);
        return chosenRuleResponse;
    }

    public ObjectAbstractResponse getRulesObject(UUID id, Integer objectIndex, Boolean isAttributes) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ObjectIndex:\t{}", objectIndex);
        logger.info("IsAttributes:\t{}", isAttributes);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        getClassificationFromProject(project);

        RulesService.getRulesFromProject(project);

        ObjectAbstractResponse objectAbstractResponse;
        if(isAttributes) {
            objectAbstractResponse = new ObjectWithAttributesResponse(project.getInformationTable(), objectIndex);
        } else {
            objectAbstractResponse = new ObjectResponse(project.getInformationTable(), objectIndex);
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
