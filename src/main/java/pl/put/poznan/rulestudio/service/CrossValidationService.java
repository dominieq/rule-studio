package pl.put.poznan.rulestudio.service;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.data.Decision;
import org.rulelearn.data.Index2IdMapper;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.*;
import org.rulelearn.sampling.CrossValidator;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.enums.*;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.exception.EmptyResponseException;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.*;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.model.response.AttributeFieldsResponse.AttributeFieldsResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ChosenCrossValidationFoldResponse.ChosenCrossValidationFoldResponseBuilder;
import pl.put.poznan.rulestudio.model.response.MainCrossValidationResponse.MainCrossValidationResponseBuilder;
import pl.put.poznan.rulestudio.model.response.OrdinalMisclassificationMatrixResponse.OrdinalMisclassificationMatrixResponseBuilder;
import pl.put.poznan.rulestudio.model.response.OrdinalMisclassificationMatrixWithoutDeviationResponse.OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder;
import pl.put.poznan.rulestudio.model.response.RuleMainPropertiesResponse.RuleMainPropertiesResponseBuilder;

import java.io.IOException;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class CrossValidationService {

    private static final Logger logger = LoggerFactory.getLogger(CrossValidationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static CrossValidation getCrossValidationFromProject(Project project) {
        CrossValidation crossValidation = project.getCrossValidation();
        if(crossValidation == null) {
            EmptyResponseException ex = new EmptyResponseException("Cross-validation hasn't been calculated.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return crossValidation;
    }

    private static CrossValidationSingleFold getChosenFoldFromCrossValidation(CrossValidation crossValidation, Integer foldIndex) {
        if((foldIndex < 0) || (foldIndex >= crossValidation.getNumberOfFolds())) {
            WrongParameterException ex = new WrongParameterException(String.format("Given fold's index \"%d\" is incorrect. You can choose fold from %d to %d", foldIndex, 0, crossValidation.getNumberOfFolds() - 1));
            logger.error(ex.getMessage());
            throw ex;
        }

        return crossValidation.getCrossValidationSingleFolds()[foldIndex];
    }

    private int[] extractIndices(InformationTable foldInformationTable, Index2IdMapper mainIndex2IdMapper) {
        int[] indices = new int[foldInformationTable.getNumberOfObjects()];
        Index2IdMapper foldIndex2IdMapper = foldInformationTable.getIndex2IdMapper();

        for(int i = 0; i < foldInformationTable.getNumberOfObjects(); i++) {
            indices[i] = mainIndex2IdMapper.getIndex( foldIndex2IdMapper.getId(i) );
        }

        return indices;
    }

    private void rearrangeIndicesOfCoveredObject(RuLeStudioRuleSet ruLeStudioRuleSet, int[] indicesOfTrainingObjects) {
        RuLeStudioRule[] ruLeStudioRules = ruLeStudioRuleSet.getRuLeStudioRules();
        for(int ruleIndex = 0; ruleIndex < ruLeStudioRules.length; ruleIndex++) {
            int[] indicesOfCoveredObjects = ruLeStudioRules[ruleIndex].getIndicesOfCoveredObjects();
            for(int listIndex = 0; listIndex < indicesOfCoveredObjects.length; listIndex++) {
                int oldIndex = indicesOfCoveredObjects[listIndex];
                int newIndex = indicesOfTrainingObjects[oldIndex];
                indicesOfCoveredObjects[listIndex] = newIndex;
            }
        }
    }

    private CrossValidation calculateCrossValidation(InformationTable informationTable, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, Integer numberOfFolds, Long seed, DescriptiveAttributes projectDescriptiveAttributes) {
        DataService.checkInformationTable(informationTable, "There is no data in project. Couldn't calculate cross-validation.");
        DataService.checkNumberOfObjects(informationTable, "There are no objects in project. Couldn't calculate cross-validation.");

        if(numberOfFolds < 2) {
            WrongParameterException ex = new WrongParameterException(String.format("There must be at least 2 folds, %d is not enough. Couldn't calculate cross-validation.", numberOfFolds));
            logger.error(ex.getMessage());
            throw ex;
        }
        if(numberOfFolds > informationTable.getNumberOfObjects()) {
            WrongParameterException ex = new WrongParameterException(String.format("Number of folds shouldn't be greater than number of objects. %d folds is more than %d objects. Couldn't calculate cross-validation.", numberOfFolds, informationTable.getNumberOfObjects()));
            logger.error(ex.getMessage());
            throw ex;
        }

        CrossValidationSingleFold[] crossValidationSingleFolds = new CrossValidationSingleFold[numberOfFolds];
        final Decision[] orderOfDecisions = informationTable.getOrderedUniqueFullyDeterminedDecisions();
        OrdinalMisclassificationMatrix[] foldOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix[numberOfFolds];

        final Index2IdMapper mainIndex2IdMapper = informationTable.getIndex2IdMapper();
        int i;
        int[] indicesOfTrainingObjects, indicesOfValidationObjects;

        CrossValidator crossValidator = new CrossValidator(new Random());
        crossValidator.setSeed(seed);
        List<CrossValidator.CrossValidationFold<InformationTable>> folds = crossValidator.splitStratifiedIntoKFold(DataService.createInformationTableWithDecisionDistributions(informationTable), numberOfFolds);
        for(i = 0; i < folds.size(); i++) {
            logger.info("Creating fold: {}/{}", i+1, folds.size());

            final InformationTable trainingTable = folds.get(i).getTrainingTable();
            final InformationTable validationTable = folds.get(i).getValidationTable();

            final UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = UnionsService.calculateUnionsWithSingleLimitingDecision(trainingTable, typeOfUnions, consistencyThreshold);
            final RuleSetWithCharacteristics ruleSetWithCharacteristics = RulesService.calculateRuleSetWithCharacteristics(unionsWithSingleLimitingDecision, typeOfRules);

            final FoldClassification foldClassification = new FoldClassification(trainingTable, validationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);

            foldOrdinalMisclassificationMatrix[i] = foldClassification.getOrdinalMisclassificationMatrix();

            indicesOfTrainingObjects = extractIndices(trainingTable, mainIndex2IdMapper);
            indicesOfValidationObjects = extractIndices(validationTable, mainIndex2IdMapper);

            final RuLeStudioRuleSet ruLeStudioRuleSet = new RuLeStudioRuleSet(ruleSetWithCharacteristics);
            rearrangeIndicesOfCoveredObject(ruLeStudioRuleSet, indicesOfTrainingObjects);

            crossValidationSingleFolds[i] = new CrossValidationSingleFold(indicesOfTrainingObjects, indicesOfValidationObjects, ruLeStudioRuleSet, foldClassification);

            //let garbage collector clean memory occupied by i-th fold
            folds.set(i, null);
        }

        final OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(orderOfDecisions, foldOrdinalMisclassificationMatrix);
        final OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(true, orderOfDecisions, foldOrdinalMisclassificationMatrix);

        final DescriptiveAttributes descriptiveAttributes = new DescriptiveAttributes(projectDescriptiveAttributes);

        CrossValidation crossValidation = new CrossValidation(numberOfFolds, informationTable, crossValidationSingleFolds, orderOfDecisions, meanOrdinalMisclassificationMatrix, sumOrdinalMisclassificationMatrix, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, seed, informationTable.getHash(), descriptiveAttributes);
        return crossValidation;
    }

    public MainCrossValidationResponse getCrossValidation(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final MainCrossValidationResponse mainCrossValidationResponse = MainCrossValidationResponseBuilder.newInstance().build(crossValidation);
        logger.debug("mainCrossValidationResponse:\t{}", mainCrossValidationResponse.toString());
        return mainCrossValidationResponse;
    }

    public MainCrossValidationResponse putCrossValidation(UUID id, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, Integer numberOfFolds, Long seed) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("NumberOfFolds:\t{}", numberOfFolds);
        logger.info("Seed:\t{}", seed);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();

        CrossValidation crossValidation = calculateCrossValidation(informationTable, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, numberOfFolds, seed, project.getDescriptiveAttributes());

        project.setCrossValidation(crossValidation);

        final MainCrossValidationResponse mainCrossValidationResponse = MainCrossValidationResponseBuilder.newInstance().build(crossValidation);
        logger.debug("mainCrossValidationResponse:\t{}", mainCrossValidationResponse.toString());
        return mainCrossValidationResponse;
    }

    public MainCrossValidationResponse postCrossValidation(UUID id, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, Integer numberOfFolds, Long seed, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("NumberOfFolds:\t{}", numberOfFolds);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);
        logger.info("Seed:\t{}", seed);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        CrossValidation crossValidation = calculateCrossValidation(informationTable, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, numberOfFolds, seed, project.getDescriptiveAttributes());

        project.setCrossValidation(crossValidation);

        final MainCrossValidationResponse mainCrossValidationResponse = MainCrossValidationResponseBuilder.newInstance().build(crossValidation);
        logger.debug("mainCrossValidationResponse:\t{}", mainCrossValidationResponse.toString());
        return mainCrossValidationResponse;
    }

    public DescriptiveAttributesResponse getDescriptiveAttributes(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse(crossValidation.getDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public DescriptiveAttributesResponse postDescriptiveAttributes(UUID id, String objectVisibleName) {
        logger.info("Id:\t{}", id);
        logger.info("ObjectVisibleName:\t{}", objectVisibleName);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        DescriptiveAttributes descriptiveAttributes = crossValidation.getDescriptiveAttributes();
        descriptiveAttributes.setCurrentAttribute(objectVisibleName);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse(crossValidation.getDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final Integer descriptiveAttributeIndex = crossValidation.getDescriptiveAttributes().getCurrentAttributeInformationTableIndex();
        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().build(crossValidation.getInformationTable(), descriptiveAttributeIndex);
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id, Integer foldIndex) {
        logger.info("Id:\t{}", id);
        logger.info("FoldIndex:\t{}", foldIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final CrossValidationSingleFold chosenFold = getChosenFoldFromCrossValidation(crossValidation, foldIndex);
        final int[] indices = chosenFold.getIndicesOfValidationObjects();
        final String[] objectNames = crossValidation.getDescriptiveAttributes().extractChosenObjectNames(crossValidation.getInformationTable(), indices);

        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().setFields(objectNames).build();
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id, Integer foldIndex, Integer ruleIndex) {
        logger.info("Id:\t{}", id);
        logger.info("FoldIndex:\t{}", foldIndex);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final CrossValidationSingleFold chosenFold = getChosenFoldFromCrossValidation(crossValidation, foldIndex);
        final int[] indices = RulesService.getCoveringObjectsIndices(chosenFold.getRuLeStudioRuleSet(), ruleIndex);
        final String[] objectNames = crossValidation.getDescriptiveAttributes().extractChosenObjectNames(crossValidation.getInformationTable(), indices);

        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().setFields(objectNames).build();
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public ChosenCrossValidationFoldResponse getChosenCrossValidationFold(UUID id, Integer foldIndex) {
        logger.info("Id:\t{}", id);
        logger.info("FoldIndex:\t{}", foldIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final ChosenCrossValidationFoldResponse chosenCrossValidationFoldResponse = ChosenCrossValidationFoldResponseBuilder.newInstance().build(crossValidation, foldIndex);
        logger.debug("chosenCrossValidationFoldResponse:\t{}", chosenCrossValidationFoldResponse.toString());
        return chosenCrossValidationFoldResponse;
    }

    public ChosenClassifiedObjectAbstractResponse getChosenClassifiedObject(UUID id, Integer foldIndex, Integer objectIndex, Boolean isAttributes) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("FoldIndex:\t{}", foldIndex);
        logger.info("ClassifiedObjectIndex:\t{}", objectIndex);
        logger.info("IsAttributes:\t{}", isAttributes);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final CrossValidationSingleFold chosenFold = getChosenFoldFromCrossValidation(crossValidation, foldIndex);

        if((objectIndex < 0) || (objectIndex >= chosenFold.getIndicesOfValidationObjects().length)) {
            WrongParameterException ex = new WrongParameterException(String.format("Given object's index \"%d\" is incorrect. You can choose object from %d to %d", objectIndex, 0, chosenFold.getIndicesOfValidationObjects().length - 1));
            logger.error(ex.getMessage());
            throw ex;
        }
        final InformationTable informationTable = crossValidation.getInformationTable();
        final int generalObjectIndex = chosenFold.getIndicesOfValidationObjects()[objectIndex];
        final IntList indicesOfCoveringRules = chosenFold.getFoldClassification().getIndicesOfCoveringRules()[objectIndex];

        ChosenClassifiedObjectAbstractResponse chosenClassifiedObjectAbstractResponse;
        if(isAttributes) {
            chosenClassifiedObjectAbstractResponse = new ChosenClassifiedObjectWithAttributesResponse(informationTable, generalObjectIndex, indicesOfCoveringRules);
        } else {
            chosenClassifiedObjectAbstractResponse = new ChosenClassifiedObjectResponse(informationTable, generalObjectIndex, indicesOfCoveringRules);
        }
        logger.debug("chosenClassifiedObjectAbstractResponse:\t{}", chosenClassifiedObjectAbstractResponse);
        return chosenClassifiedObjectAbstractResponse;
    }

    public RuleMainPropertiesResponse getRule(UUID id, Integer foldIndex, Integer ruleIndex) {
        logger.info("Id:\t{}", id);
        logger.info("FoldIndex:\t{}", foldIndex);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final CrossValidationSingleFold chosenFold = getChosenFoldFromCrossValidation(crossValidation, foldIndex);

        final RuleMainPropertiesResponse ruleMainPropertiesResponse = RuleMainPropertiesResponseBuilder.newInstance().build(chosenFold.getRuLeStudioRuleSet(), ruleIndex);
        logger.debug("ruleMainPropertiesResponse:\t{}", ruleMainPropertiesResponse);
        return ruleMainPropertiesResponse;
    }

    public ChosenRuleResponse getRuleCoveringObjects(UUID id, Integer foldIndex, Integer ruleIndex) {
        logger.info("Id:\t{}", id);
        logger.info("FoldIndex:\t{}", foldIndex);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final CrossValidationSingleFold chosenFold = getChosenFoldFromCrossValidation(crossValidation, foldIndex);

        final ChosenRuleResponse chosenRuleResponse = ChosenRuleResponse.ChosenRuleResponseBuilder.newInstance().build(chosenFold.getRuLeStudioRuleSet(), ruleIndex, crossValidation.getDescriptiveAttributes(), crossValidation.getInformationTable());
        logger.debug("chosenRuleResponse:\t{}", chosenRuleResponse);
        return chosenRuleResponse;
    }

    public ObjectAbstractResponse getObject(UUID id, Integer objectIndex, Boolean isAttributes) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ObjectIndex:\t{}", objectIndex);
        logger.info("IsAttributes:\t{}", isAttributes);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        ObjectAbstractResponse objectAbstractResponse;
        if(isAttributes) {
            objectAbstractResponse = new ObjectWithAttributesResponse(crossValidation.getInformationTable(), objectIndex);
        } else {
            objectAbstractResponse = new ObjectResponse(crossValidation.getInformationTable(), objectIndex);
        }
        logger.debug("objectAbstractResponse:\t{}", objectAbstractResponse.toString());
        return objectAbstractResponse;
    }

    public OrdinalMisclassificationMatrixAbstractResponse getMisclassificationMatrix(UUID id, MisclassificationMatrixType typeOfMatrix, Integer numberOfFold) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfMatrix:\t{}", typeOfMatrix);
        if(numberOfFold != null) logger.info("NumberOfFold:\t{}", numberOfFold);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final Decision[] orderOfDecisions = crossValidation.getOrderOfDecisions();

        OrdinalMisclassificationMatrixAbstractResponse ordinalMisclassificationMatrixAbstractResponse;
        switch(typeOfMatrix) {
            case CROSS_VALIDATION_SUM:
                ordinalMisclassificationMatrixAbstractResponse = OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder.newInstance().build(crossValidation.getSumOrdinalMisclassificationMatrix(), orderOfDecisions);
                break;

            case CROSS_VALIDATION_MEAN:
                ordinalMisclassificationMatrixAbstractResponse = OrdinalMisclassificationMatrixResponseBuilder.newInstance().build(crossValidation.getMeanOrdinalMisclassificationMatrix(), orderOfDecisions);
                break;

            case CROSS_VALIDATION_FOLD:
                CrossValidationSingleFold[] crossValidationSingleFolds = crossValidation.getCrossValidationSingleFolds();
                OrdinalMisclassificationMatrix foldMatrix;

                if(numberOfFold == null) {
                    WrongParameterException ex = new WrongParameterException(String.format("The number of fold is not given."));
                    logger.error(ex.getMessage());
                    throw ex;
                }
                try {
                    foldMatrix = crossValidationSingleFolds[numberOfFold].getFoldClassification().getOrdinalMisclassificationMatrix();
                } catch (ArrayIndexOutOfBoundsException e) {
                    WrongParameterException ex = new WrongParameterException(String.format("There is no fold with number %d.", numberOfFold));
                    logger.error(ex.getMessage());
                    throw ex;
                }

                ordinalMisclassificationMatrixAbstractResponse = OrdinalMisclassificationMatrixWithoutDeviationResponseBuilder.newInstance().build(foldMatrix, orderOfDecisions);
                break;

            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given type of misclassification matrix \"%s\" is unrecognized in cross-validation.", typeOfMatrix));
                logger.error(ex.getMessage());
                throw ex;
        }

        logger.debug("ordinalMisclassificationMatrixAbstractResponse:\t{}", ordinalMisclassificationMatrixAbstractResponse.toString());
        return ordinalMisclassificationMatrixAbstractResponse;
    }
}
