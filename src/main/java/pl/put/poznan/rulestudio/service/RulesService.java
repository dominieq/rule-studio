package pl.put.poznan.rulestudio.service;

import it.unimi.dsi.fastutil.ints.IntArraySet;
import org.rulelearn.approximations.Union;
import org.rulelearn.approximations.Unions;
import org.rulelearn.approximations.VCDominanceBasedRoughSetCalculator;
import org.rulelearn.core.UnknownValueException;
import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.measures.dominance.EpsilonConsistencyMeasure;
import org.rulelearn.rules.*;
import org.rulelearn.rules.ruleml.RuleMLBuilder;
import org.rulelearn.rules.ruleml.RuleParseException;
import org.rulelearn.rules.ruleml.RuleParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.enums.OrderByRuleCharacteristic;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.RulesFormat;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.exception.*;
import pl.put.poznan.rulestudio.model.*;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.model.response.AttributeFieldsResponse.AttributeFieldsResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ChosenRuleResponse.ChosenRuleResponseBuilder;
import pl.put.poznan.rulestudio.model.response.DescriptiveAttributesResponse.DescriptiveAttributtesResponseBuilder;
import pl.put.poznan.rulestudio.model.response.MainRulesResponse.MainRulesResponseBuilder;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class RulesService {

    private static final Logger logger = LoggerFactory.getLogger(RulesService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private class ArrayIndexComparator implements Comparator<Integer> {
        private final Number[] array;

        public ArrayIndexComparator(Number[] array) {
            this.array = array;
        }

        public Integer[] createIndexArray()
        {
            Integer[] indices = new Integer[array.length];
            for (int i = 0; i < array.length; i++)
            {
                indices[i] = i;
            }
            return indices;
        }

        @Override
        public int compare(Integer ind1, Integer ind2) {
            if (array[ind1] instanceof Integer) {
                Integer val1 = (Integer)array[ind1];
                Integer val2 = (Integer)array[ind2];

                if ((val1.equals(RuleCharacteristics.UNKNOWN_INT_VALUE)) && (val2.equals(RuleCharacteristics.UNKNOWN_INT_VALUE))) {
                    return ind1.compareTo(ind2);
                }
                if (val1.equals(RuleCharacteristics.UNKNOWN_INT_VALUE)) {
                    return -1;
                }
                if (val2.equals(RuleCharacteristics.UNKNOWN_INT_VALUE)) {
                    return 1;
                }
                return val1.compareTo(val2);

            } else if (array[ind1] instanceof Double) {
                Double val1 = (Double)array[ind1];
                Double val2 = (Double)array[ind2];

                if ((val1.equals(RuleCharacteristics.UNKNOWN_DOUBLE_VALUE)) && (val2.equals(RuleCharacteristics.UNKNOWN_DOUBLE_VALUE))) {
                    return ind1.compareTo(ind2);
                }
                if (val1.equals(RuleCharacteristics.UNKNOWN_DOUBLE_VALUE)) {
                    return -1;
                }
                if (val2.equals(RuleCharacteristics.UNKNOWN_DOUBLE_VALUE)) {
                    return 1;
                }
                return val1.compareTo(val2);
            }

            return ind1.compareTo(ind2);
        }
    }

    interface NumberCharacteristic {
        Number get(int index);
    }

    private static void collectIntegerCharacteristicLoop(int rulesNumber, Number[] characteristicValues, NumberCharacteristic function) {
        for(int i = 0; i < rulesNumber; i++) {
            try {
                characteristicValues[i] = function.get(i);
            } catch (UnknownValueException e)  {
                logger.debug(e.getMessage());
                characteristicValues[i] = RuleCharacteristics.UNKNOWN_INT_VALUE;
            }
        }
    }

    private static void collectDoubleCharacteristicLoop(int rulesNumber, Number[] characteristicValues, NumberCharacteristic function) {
        for(int i = 0; i < rulesNumber; i++) {
            try {
                characteristicValues[i] = function.get(i);
            } catch (UnknownValueException e)  {
                logger.debug(e.getMessage());
                characteristicValues[i] = RuleCharacteristics.UNKNOWN_DOUBLE_VALUE;
            }
        }
    }

    public static RuleSetWithComputableCharacteristics parseComputableRules(MultipartFile rulesFile, Attribute[] attributes) throws IOException {
        Map<Integer, RuleSetWithCharacteristics> parsedRules = null;
        RuleParser ruleParser = new RuleParser(attributes);
        parsedRules = ruleParser.parseRulesWithCharacteristics(rulesFile.getInputStream());

        for(RuleSetWithCharacteristics rswc : parsedRules.values()) {
            logger.info("ruleSet.size=" + rswc.size());
            for(int i = 0; i < rswc.size(); i++) {
                RuleCharacteristics ruleCharacteristics = rswc.getRuleCharacteristics(i);
                logger.info(i + ":\t" + ruleCharacteristics.toString());
            }
        }

        Map.Entry<Integer, RuleSetWithCharacteristics> entry = parsedRules.entrySet().iterator().next();
        RuleSetWithCharacteristics ruleSetWithCharacteristics = entry.getValue();

        Rule[] rules = new Rule[ruleSetWithCharacteristics.size()];
        for(int i = 0; i < ruleSetWithCharacteristics.size(); i++) {
            rules[i] = ruleSetWithCharacteristics.getRule(i);
        }

        RuleCoverageInformation[] ruleCoverageInformation = new RuleCoverageInformation[ruleSetWithCharacteristics.size()];
        for(int i = 0; i < ruleSetWithCharacteristics.size(); i++) {
            RuleConditions ruleConditions = new RuleConditions(new InformationTable(new Attribute[0], new ArrayList<>()), new IntArraySet(), new IntArraySet(), new IntArraySet(), org.rulelearn.rules.RuleType.POSSIBLE, RuleSemantics.AT_MOST);
            ruleCoverageInformation[i] = new RuleCoverageInformation(ruleConditions);
        }

        return new RuleSetWithComputableCharacteristics(
                rules,
                ruleCoverageInformation
        );
    }

    public static RuleSetWithCharacteristics parseRules(MultipartFile rulesFile, Attribute[] attributes) throws IOException {
        Map<Integer, RuleSetWithCharacteristics> parsedRules = null;
        RuleParser ruleParser = new RuleParser(attributes);
        try {
            parsedRules = ruleParser.parseRulesWithCharacteristics(rulesFile.getInputStream());
        } catch (RuleParseException e) {
            WrongParameterException ex = new WrongParameterException(e.getMessage());
            logger.error(ex.getMessage());
            throw ex;
        }

        if(parsedRules == null) {
            WrongParameterException ex = new WrongParameterException(String.format("Given file with rules could not be successfully read as RuleML file."));
            logger.error(ex.getMessage());
            throw ex;
        } else if (parsedRules.entrySet().iterator().next().getValue().size() == 0) {
            WrongParameterException ex = new WrongParameterException(String.format("Parser could not process any rule. Make sure that the file is not empty and its content is compatible with current project's metadata."));
            logger.error(ex.getMessage());
            throw ex;
        }

        for(RuleSetWithCharacteristics rswc : parsedRules.values()) {
            logger.info("ruleSet.size=" + rswc.size());
            for(int i = 0; i < rswc.size(); i++) {
                RuleCharacteristics ruleCharacteristics = rswc.getRuleCharacteristics(i);
                logger.info(i + ":\t" + ruleCharacteristics.toString());
            }
        }

        Map.Entry<Integer, RuleSetWithCharacteristics> entry = parsedRules.entrySet().iterator().next();
        RuleSetWithCharacteristics ruleSetWithCharacteristics = entry.getValue();

        logger.info("LearningInformationTableHash:\t{}", ruleSetWithCharacteristics.getLearningInformationTableHash());
        return ruleSetWithCharacteristics;
    }

    public static RuleSetWithCharacteristics calculateRuleSetWithCharacteristics(Unions unions, RuleType typeOfRules) {
        if((typeOfRules == RuleType.POSSIBLE) || (typeOfRules == RuleType.BOTH)) {
            if(!unions.getInformationTable().isSuitableForInductionOfPossibleRules()) {
                NotSuitableForInductionOfPossibleRulesException ex = new NotSuitableForInductionOfPossibleRulesException("Creating possible rules is not possible - learning data contain missing attribute values that can lead to non-transitivity of dominance/indiscernibility relation.");
                logger.error(ex.getMessage());
                throw ex;
            }

            logger.info("Current learning data is acceptable to create possible rules.");
        }

        RuleInducerComponents ruleInducerComponents = null;

        ApproximatedSetProvider unionAtLeastProvider = new UnionProvider(Union.UnionType.AT_LEAST, unions);
        ApproximatedSetProvider unionAtMostProvider = new UnionProvider(Union.UnionType.AT_MOST, unions);
        ApproximatedSetRuleDecisionsProvider unionRuleDecisionsProvider = new UnionWithSingleLimitingDecisionRuleDecisionsProvider();

        RuleSetWithComputableCharacteristics rules = null;
        RuleSetWithCharacteristics resultSet = null;


        if((typeOfRules == RuleType.POSSIBLE) || (typeOfRules == RuleType.BOTH)) {
            ruleInducerComponents = new PossibleRuleInducerComponents.Builder().
                    build();

            rules = (new VCDomLEM(ruleInducerComponents, unionAtLeastProvider, unionRuleDecisionsProvider)).generateRules();
            rules.calculateAllCharacteristics();
            resultSet = rules;

            rules = (new VCDomLEM(ruleInducerComponents, unionAtMostProvider, unionRuleDecisionsProvider)).generateRules();
            rules.calculateAllCharacteristics();
            resultSet = RuleSetWithCharacteristics.join(resultSet, rules);
        }


        if((typeOfRules == RuleType.CERTAIN) || (typeOfRules == RuleType.BOTH)) {
            final RuleInductionStoppingConditionChecker stoppingConditionChecker =
                    new EvaluationAndCoverageStoppingConditionChecker(
                            EpsilonConsistencyMeasure.getInstance(),
                            EpsilonConsistencyMeasure.getInstance(),
                            ((VCDominanceBasedRoughSetCalculator) unions.getRoughSetCalculator()).getLowerApproximationConsistencyThreshold()
                    );

            ruleInducerComponents = new CertainRuleInducerComponents.Builder().
                    ruleInductionStoppingConditionChecker(stoppingConditionChecker).
                    ruleConditionsPruner(new AttributeOrderRuleConditionsPruner(stoppingConditionChecker)).
                    build();

            rules = (new VCDomLEM(ruleInducerComponents, unionAtLeastProvider, unionRuleDecisionsProvider)).generateRules();
            rules.calculateAllCharacteristics();
            if(resultSet == null) {
                resultSet = rules;
            } else {
                resultSet = RuleSetWithCharacteristics.join(resultSet, rules);
            }

            rules = (new VCDomLEM(ruleInducerComponents, unionAtMostProvider, unionRuleDecisionsProvider)).generateRules();
            rules.calculateAllCharacteristics();
            resultSet = RuleSetWithCharacteristics.join(resultSet, rules);
        }

        resultSet.setLearningInformationTableHash(unions.getInformationTable().getHash());
        return resultSet;
    }

    public static void calculateRulesWithHttpParametersInProject(Project project, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules) {
        UnionsService.calculateUnionsWithHttpParametersInProject(project, typeOfUnions, consistencyThreshold);
        UnionsWithHttpParameters unionsWithHttpParameters = project.getUnions();

        RulesWithHttpParameters rules = project.getRules();
        if ((!project.isCurrentRules()) || (rules.getTypeOfUnions() != typeOfUnions) || (!rules.getConsistencyThreshold().equals(consistencyThreshold)) || (rules.getTypeOfRules() != typeOfRules)) {
            RuleSetWithCharacteristics ruleSetWithCharacteristics = calculateRuleSetWithCharacteristics(unionsWithHttpParameters.getUnions(), typeOfRules);
            DescriptiveAttributes descriptiveAttributes = new DescriptiveAttributes(project.getInformationTable());
            rules = new RulesWithHttpParameters(ruleSetWithCharacteristics, typeOfUnions, consistencyThreshold, typeOfRules, descriptiveAttributes);

            project.setRules(rules);
            project.setCurrentRules(true);
        } else {
            logger.info("Rules are already calculated with given configuration, skipping current calculation.");
        }
    }

    public static RulesWithHttpParameters getRulesFromProject(Project project) {
        RulesWithHttpParameters rules = project.getRules();
        if(rules == null) {
            EmptyResponseException ex = new EmptyResponseException("There are no rules in project to show.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return rules;
    }

    public static int[] getCoveringObjectsIndices(RuleSetWithCharacteristics ruleSetWithCharacteristics, Integer ruleIndex) {
        int[] indices;

        if((ruleIndex < 0) || (ruleIndex >= ruleSetWithCharacteristics.size())) {
            WrongParameterException ex = new WrongParameterException(String.format("Given rule's index \"%d\" is incorrect. You can choose rule from %d to %d", ruleIndex, 0, ruleSetWithCharacteristics.size() - 1));
            logger.error(ex.getMessage());
            throw ex;
        }

        final RuleCharacteristics ruleCharacteristics = ruleSetWithCharacteristics.getRuleCharacteristics(ruleIndex);
        final BasicRuleCoverageInformation basicRuleCoverageInformation = ruleCharacteristics.getRuleCoverageInformation();
        if(basicRuleCoverageInformation != null) {
            indices = basicRuleCoverageInformation.getIndicesOfCoveredObjects().toIntArray();
        } else {
            indices = new int[0];
        }

        return indices;
    }

    public static int[] getCoveringObjectsIndices(RuLeStudioRuleSet ruLeStudioRuleSet, Integer ruleIndex) {
        final RuLeStudioRule[] rules = ruLeStudioRuleSet.getRuLeStudioRules();
        if((ruleIndex < 0) || (ruleIndex >= rules.length)) {
            WrongParameterException ex = new WrongParameterException(String.format("Given rule's index \"%d\" is incorrect. You can choose rule from %d to %d", ruleIndex, 0, rules.length - 1));
            logger.error(ex.getMessage());
            throw ex;
        }

        return rules[ruleIndex].getIndicesOfCoveredObjects();
    }

    public MainRulesResponse getRules(UUID id, OrderByRuleCharacteristic orderBy, Boolean desc) {
        logger.info("Id:\t{}", id);
        logger.info("OrderBy:\t{}", orderBy);
        logger.info("Desc:\t{}", desc);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        project.checkValidityOfRules();
        getRulesFromProject(project);

        RulesWithHttpParameters rules;
        try {
            rules = (RulesWithHttpParameters) project.getRules().clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            rules = project.getRules();
        }

        final RuleSetWithCharacteristics ruleSetWithCharacteristics = rules.getRuleSet();
        if (!orderBy.equals(OrderByRuleCharacteristic.NONE)) {

            int i, rulesNumber = ruleSetWithCharacteristics.size();

            Rule[] ruleArray = new Rule[rulesNumber];

            RuleCharacteristics[] ruleCharacteristicsArray = new RuleCharacteristics[rulesNumber];
            for(i = 0; i < rulesNumber; i++) {
                ruleCharacteristicsArray[i] = ruleSetWithCharacteristics.getRuleCharacteristics(i);
            }

            Number[] characteristicValues = new Number[rulesNumber];
            switch (orderBy) {
                case SUPPORT:
                    collectIntegerCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getSupport());
                    break;
                case STRENGTH:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getStrength());
                    break;
                case CONFIDENCE:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getConfidence());
                    break;
                case COVERAGE_FACTOR:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getCoverageFactor());
                    break;
                case COVERAGE:
                    collectIntegerCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getCoverage());
                    break;
                case NEGATIVE_COVERAGE:
                    collectIntegerCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getNegativeCoverage());
                    break;
                case EPSILON:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getEpsilon());
                    break;
                case EPSILON_PRIME:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getEpsilonPrime());
                    break;
                case F_CONFIRMATION:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getFConfirmation());
                    break;
                case A_CONFIRMATION:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getAConfirmation());
                    break;
                case Z_CONFIRMATION:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getZConfirmation());
                    break;
                case L_CONFIRMATION:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getLConfirmation());
                    break;
                case C1_CONFIRMATION:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getC1Confirmation());
                    break;
                case S_CONFIRMATION:
                    collectDoubleCharacteristicLoop(rulesNumber, characteristicValues, (int index) -> ruleCharacteristicsArray[index].getSConfirmation());
                    break;
                default:
                    WrongParameterException ex = new WrongParameterException(String.format("Given ordering rule characteristic \"%s\" is unrecognized.", orderBy));
                    logger.error(ex.getMessage());
                    throw ex;
            }

            final ArrayIndexComparator comparator = new ArrayIndexComparator(characteristicValues);
            final Integer[] indices = comparator.createIndexArray();
            Arrays.sort(indices, comparator);

            int x, step;
            if(desc) {
                x = rulesNumber - 1;
                step = -1;
            } else {
                x = 0;
                step = 1;
            }
            for(i = 0; i < rulesNumber; i++) {
                ruleArray[i] = ruleSetWithCharacteristics.getRule(indices[x]);
                ruleCharacteristicsArray[i] = ruleSetWithCharacteristics.getRuleCharacteristics(indices[x]);
                logger.debug("{}:\tsupport={}\tindex={}", i, characteristicValues[indices[x]], indices[x]);
                x += step;
            }

            RuleSetWithCharacteristics sortedRuleSet = new RuleSetWithCharacteristics(ruleArray, ruleCharacteristicsArray);
            sortedRuleSet.setLearningInformationTableHash(ruleSetWithCharacteristics.getLearningInformationTableHash());
            rules.setRuleSet(sortedRuleSet);
        }

        final MainRulesResponse mainRulesResponse = MainRulesResponseBuilder.newInstance().build(rules);
        logger.debug("mainRulesResponse:\t{}", mainRulesResponse.toString());
        return mainRulesResponse;
    }

    public MainRulesResponse putRules(UUID id, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateRulesWithHttpParametersInProject(project, typeOfUnions, consistencyThreshold, typeOfRules);

        final RulesWithHttpParameters rules = project.getRules();
        final MainRulesResponse mainRulesResponse = MainRulesResponseBuilder.newInstance().build(rules);
        logger.debug("mainRulesResponse:\t{}", mainRulesResponse.toString());
        return mainRulesResponse;
    }

    public MainRulesResponse postRules(UUID id, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateRulesWithHttpParametersInProject(project, typeOfUnions, consistencyThreshold, typeOfRules);

        final RulesWithHttpParameters rules = project.getRules();
        final MainRulesResponse mainRulesResponse = MainRulesResponseBuilder.newInstance().build(rules);
        logger.debug("mainRulesResponse:\t{}", mainRulesResponse.toString());
        return mainRulesResponse;
    }

    public DescriptiveAttributesResponse getDescriptiveAttributes(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final RulesWithHttpParameters rules = getRulesFromProject(project);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = DescriptiveAttributtesResponseBuilder.newInstance().build(rules.getDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public DescriptiveAttributesResponse postDescriptiveAttributes(UUID id, String objectVisibleName) {
        logger.info("Id:\t{}", id);
        logger.info("ObjectVisibleName:\t{}", objectVisibleName);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final RulesWithHttpParameters rules = getRulesFromProject(project);

        DescriptiveAttributes descriptiveAttributes = rules.getDescriptiveAttributes();
        descriptiveAttributes.setCurrentAttribute(objectVisibleName);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = DescriptiveAttributtesResponseBuilder.newInstance().build(rules.getDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final RulesWithHttpParameters rules = getRulesFromProject(project);

        final Integer descriptiveAttributeIndex = rules.getDescriptiveAttributes().getCurrentAttributeInformationTableIndex();
        AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().build(project.getInformationTable(), descriptiveAttributeIndex);
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id, Integer ruleIndex) {
        logger.info("Id:\t{}", id);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final RulesWithHttpParameters rules = getRulesFromProject(project);

        final int[] indices = getCoveringObjectsIndices(rules.getRuleSet(), ruleIndex);
        String[] objectNames = rules.getDescriptiveAttributes().extractChosenObjectNames(project.getInformationTable(), indices);

        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().setFields(objectNames).build();
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public NamedResource download(UUID id, RulesFormat rulesFormat) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("RulesFormat:\t{}", rulesFormat);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        if(project.getRules() == null) {
            NoRulesException ex = new NoRulesException("There are no rules in this project.");
            logger.error(ex.getMessage());
            throw ex;
        }

        RuleSetWithCharacteristics ruleSetWithCharacteristics = project.getRules().getRuleSet();
        String rulesString;

        switch (rulesFormat) {
            case XML:
                RuleMLBuilder ruleMLBuilder = new RuleMLBuilder();
                rulesString = ruleMLBuilder.toRuleMLString(ruleSetWithCharacteristics, 1);
                break;
            case TXT:
                rulesString = ruleSetWithCharacteristics.serialize();
                break;
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given format of rules \"%s\" is unrecognized.", rulesFormat));
                logger.error(ex.getMessage());
                throw ex;
        }

        InputStream is = new ByteArrayInputStream(rulesString.getBytes());
        InputStreamResource resource = new InputStreamResource(is);

        return new NamedResource(project.getName(), resource);
    }

    public static void checkCoverageOfUploadedRules(RulesWithHttpParameters rules, InformationTable informationTable) {
        String errorMessage = null;
        String ruleSetHash = rules.getRuleSet().getLearningInformationTableHash();

        if((rules.isExternalRules()) && ((rules.isCoveragePresent() == null) || (!rules.isCoveragePresent()))) {
            if(ruleSetHash == null) {
                errorMessage = String.format("Provided rule set doesn't have the learning information table hash. It can't be determined, if this rule set was generated based on the current data of the project. Rule coverage information can't be calculated without a valid training set. Current data hash: \"%s\".", informationTable.getHash());
                logger.info(errorMessage);

                rules.setCurrentData(null);
                rules.setCoveragePresent(false);
                rules.setDescriptiveAttributes(new DescriptiveAttributes());
            } else if(ruleSetHash.equals(informationTable.getHash())) {
                logger.info("Current metadata and objects in the project are correct training set of uploaded rules. Calculating rule coverage information.");
                rules.getRuleSet().calculateBasicRuleCoverageInformation(informationTable);

                errorMessage = null;
                rules.setCurrentData(true);
                rules.setCoveragePresent(true);
                rules.setDescriptiveAttributes(new DescriptiveAttributes(informationTable));
            } else {
                errorMessage = String.format("Uploaded rules are not induced from the data in the current project. Access to a valid training set is required to calculate rule coverage information. Please upload new rules based on the current data or create a new project with a valid training set. Current data hash: \"%s\", rules hash: \"%s\".", informationTable.getHash(), ruleSetHash);
                logger.info(errorMessage);

                rules.setCurrentData(false);
                rules.setCoveragePresent(false);
                rules.setDescriptiveAttributes(new DescriptiveAttributes());
            }
        }

        rules.setErrorMessage(errorMessage);
    }

    private static void uploadRulesToProject(Project project, MultipartFile rulesFile) throws IOException {
        InformationTable informationTable = project.getInformationTable();
        DataService.checkInformationTable(informationTable, "There is no data in project. Couldn't read rules file.");

        Attribute[] attributes = informationTable.getAttributes();
        if((attributes == null) || (attributes.length == 0)) {
            NoDataException ex = new NoDataException("There is no metadata in project. Couldn't read rules file.");
            logger.error(ex.getMessage());
            throw ex;
        }

        RuleSetWithCharacteristics ruleSetWithCharacteristics = parseRules(rulesFile, attributes);

        project.setRules(new RulesWithHttpParameters(ruleSetWithCharacteristics, rulesFile.getOriginalFilename()));
    }

    public MainRulesResponse putUploadRules(UUID id, MultipartFile rulesFile) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("Rules:\t{}\t{}", rulesFile.getOriginalFilename(), rulesFile.getContentType());

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        uploadRulesToProject(project, rulesFile);

        final RulesWithHttpParameters rules = project.getRules();
        final MainRulesResponse mainRulesResponse = MainRulesResponseBuilder.newInstance().build(rules);
        logger.debug("mainRulesResponse:\t{}", mainRulesResponse.toString());
        return mainRulesResponse;
    }

    public MainRulesResponse postUploadRules(UUID id, MultipartFile rulesFile, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("Rules:\t{}\t{}", rulesFile.getOriginalFilename(), rulesFile.getContentType());
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        uploadRulesToProject(project, rulesFile);

        final RulesWithHttpParameters rules = project.getRules();
        final MainRulesResponse mainRulesResponse = MainRulesResponseBuilder.newInstance().build(rules);
        logger.debug("mainRulesResponse:\t{}", mainRulesResponse.toString());
        return mainRulesResponse;
    }

    public ChosenRuleResponse getChosenRule(UUID id, Integer ruleIndex) {
        logger.info("Id:\t{}", id);
        logger.info("RuleIndex:\t{}", ruleIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final RulesWithHttpParameters rules = getRulesFromProject(project);

        final ChosenRuleResponse chosenRuleResponse = ChosenRuleResponseBuilder.newInstance().build(rules.getRuleSet(), ruleIndex, rules.getDescriptiveAttributes(), project.getInformationTable());
        logger.debug("chosenRuleResponse:\t{}", chosenRuleResponse.toString());
        return chosenRuleResponse;
    }

    public ObjectAbstractResponse getObject(UUID id, Integer objectIndex, Boolean isAttributes) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("RuleIndex:\t{}", objectIndex);
        logger.info("IsAttributes:\t{}", isAttributes);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        getRulesFromProject(project);

        ObjectAbstractResponse objectAbstractResponse;
        if(isAttributes) {
            objectAbstractResponse = new ObjectWithAttributesResponse(project.getInformationTable(), objectIndex);
        } else {
            objectAbstractResponse = new ObjectResponse(project.getInformationTable(), objectIndex);
        }
        logger.debug("objectAbstractResponse:\t{}", objectAbstractResponse.toString());
        return objectAbstractResponse;
    }

    public Boolean arePossibleRulesAllowed(UUID id)  {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        return project.getInformationTable().isSuitableForInductionOfPossibleRules();
    }
}
