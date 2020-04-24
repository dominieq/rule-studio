package pl.put.poznan.rulework.service;

import it.unimi.dsi.fastutil.ints.Int2ObjectArrayMap;
import it.unimi.dsi.fastutil.ints.IntArrayList;
import it.unimi.dsi.fastutil.ints.IntArraySet;
import javafx.util.Pair;
import org.rulelearn.approximations.Union;
import org.rulelearn.approximations.Unions;
import org.rulelearn.approximations.VCDominanceBasedRoughSetCalculator;
import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.measures.dominance.EpsilonConsistencyMeasure;
import org.rulelearn.rules.*;
import org.rulelearn.rules.ruleml.RuleMLBuilder;
import org.rulelearn.rules.ruleml.RuleParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.enums.RuleType;
import pl.put.poznan.rulework.enums.RulesFormat;
import pl.put.poznan.rulework.enums.UnionType;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.exception.NoRulesException;
import pl.put.poznan.rulework.exception.NotSuitableForInductionOfPossibleRulesException;
import pl.put.poznan.rulework.exception.WrongParameterException;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;
import pl.put.poznan.rulework.model.RulesWithHttpParameters;
import pl.put.poznan.rulework.model.UnionsWithHttpParameters;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.UUID;

@Service
public class RulesService {

    private static final Logger logger = LoggerFactory.getLogger(RulesService.class);

    @Autowired
    ProjectsContainer projectsContainer;

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
            ruleCoverageInformation[i] = new RuleCoverageInformation(new IntArraySet(), new IntArraySet(), new IntArrayList(), new Int2ObjectArrayMap<>(), 0);
        }

        return new RuleSetWithComputableCharacteristics(
                rules,
                ruleCoverageInformation
        );
    }

    public static RuleSetWithCharacteristics parseRules(MultipartFile rulesFile, Attribute[] attributes) throws IOException {
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
        if ((!project.isCurrentRules()) || (rules.getTypeOfUnions() != typeOfUnions) || (rules.getConsistencyThreshold() != consistencyThreshold) || (rules.getTypeOfRules() != typeOfRules)) {
            RuleSetWithCharacteristics ruleSetWithCharacteristics = calculateRuleSetWithCharacteristics(unionsWithHttpParameters.getUnions(), typeOfRules);
            rules = new RulesWithHttpParameters(ruleSetWithCharacteristics, typeOfUnions, consistencyThreshold, typeOfRules, false);

            project.setRules(rules);
            project.setCurrentRules(true);
        } else {
            logger.info("Rules are already calculated with given configuration, skipping current calculation.");
        }
    }

    public RulesWithHttpParameters getRules(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        RulesWithHttpParameters rules = project.getRules();
        if(rules == null) {
            EmptyResponseException ex = new EmptyResponseException("There are no rules in project to show.");
            logger.error(ex.getMessage());
            throw ex;
        }

        logger.debug("rulesWithHttpParameters:\t{}", rules.toString());
        return rules;
    }

    public RulesWithHttpParameters putRules(UUID id, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateRulesWithHttpParametersInProject(project, typeOfUnions, consistencyThreshold, typeOfRules);

        return project.getRules();
    }

    public RulesWithHttpParameters postRules(UUID id, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateRulesWithHttpParametersInProject(project, typeOfUnions, consistencyThreshold, typeOfRules);

        return project.getRules();
    }

    public Pair<String, Resource> download(UUID id, RulesFormat rulesFormat) throws IOException {
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

        return new Pair<>(project.getName(), resource);
    }

    public Boolean arePossibleRulesAllowed(UUID id)  {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        return project.getInformationTable().isSuitableForInductionOfPossibleRules();
    }
}
