package pl.put.poznan.rulework.service;

import it.unimi.dsi.fastutil.ints.Int2ObjectArrayMap;
import it.unimi.dsi.fastutil.ints.IntArrayList;
import it.unimi.dsi.fastutil.ints.IntArraySet;
import javafx.util.Pair;
import org.rulelearn.approximations.Union;
import org.rulelearn.approximations.Unions;
import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.approximations.VCDominanceBasedRoughSetCalculator;
import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.InformationTableWithDecisionDistributions;
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
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

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

        return ruleSetWithCharacteristics;
    }

    public static RuleSetWithComputableCharacteristics calculateRuleSetWithComputableCharacteristics(Unions unions, String typeOfRules) {
        RuleInducerComponents ruleInducerComponents = null;

        ApproximatedSetProvider unionAtLeastProvider = new UnionProvider(Union.UnionType.AT_LEAST, unions);
        ApproximatedSetProvider unionAtMostProvider = new UnionProvider(Union.UnionType.AT_MOST, unions);
        ApproximatedSetRuleDecisionsProvider unionRuleDecisionsProvider = new UnionWithSingleLimitingDecisionRuleDecisionsProvider();

        RuleSetWithComputableCharacteristics rules = null;
        RuleSetWithComputableCharacteristics resultSet = null;


        if(typeOfRules.equals("possible") || (typeOfRules.equals("both"))) {
            ruleInducerComponents = new PossibleRuleInducerComponents.Builder().
                    build();

            rules = (new VCDomLEM(ruleInducerComponents, unionAtLeastProvider, unionRuleDecisionsProvider)).generateRules();
            rules.calculateAllCharacteristics();
            resultSet = rules;

            rules = (new VCDomLEM(ruleInducerComponents, unionAtMostProvider, unionRuleDecisionsProvider)).generateRules();
            rules.calculateAllCharacteristics();
            resultSet = RuleSetWithComputableCharacteristics.join(resultSet, rules);
        }


        if(typeOfRules.equals("certain") || (typeOfRules.equals("both"))) {
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
                resultSet = RuleSetWithComputableCharacteristics.join(resultSet, rules);
            }

            rules = (new VCDomLEM(ruleInducerComponents, unionAtMostProvider, unionRuleDecisionsProvider)).generateRules();
            rules.calculateAllCharacteristics();
            resultSet = RuleSetWithComputableCharacteristics.join(resultSet, rules);
        }

        return resultSet;
    }

    public static void calculateRuleSetWithComputableCharacteristicsInProject(Project project, String typeOfUnions, Double consistencyThreshold, String typeOfRules) {
        Unions unions = project.getUnionsWithSingleLimitingDecision();
        if((project.isCalculatedUnionsWithSingleLimitingDecision()) || (project.getTypeOfUnions() != typeOfUnions) || (project.getConsistencyThreshold() != consistencyThreshold)) {
            logger.info("Calculating new set of unions");
            UnionsWithSingleLimitingDecisionService.calculateUnionsWithSingleLimitingDecisionInProject(project, typeOfUnions, consistencyThreshold);

            unions = project.getUnionsWithSingleLimitingDecision();
        }
        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = calculateRuleSetWithComputableCharacteristics(unions, typeOfRules);

        project.setRuleSetWithComputableCharacteristics(ruleSetWithComputableCharacteristics);
    }

    public RuleSetWithComputableCharacteristics getRules(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = project.getRuleSetWithComputableCharacteristics();
        if(ruleSetWithComputableCharacteristics == null) {
            EmptyResponseException ex = new EmptyResponseException("Rules", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        logger.debug("ruleSetWithComputableCharacteristics:\t{}", ruleSetWithComputableCharacteristics.toString());
        return ruleSetWithComputableCharacteristics;
    }

    public RuleSetWithComputableCharacteristics putRules(UUID id, String typeOfUnions, Double consistencyThreshold, String typeOfRules) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        calculateRuleSetWithComputableCharacteristicsInProject(project, typeOfUnions, consistencyThreshold, typeOfRules);

        return project.getRuleSetWithComputableCharacteristics();
    }

    public RuleSetWithComputableCharacteristics postRules(UUID id, String typeOfUnions, Double consistencyThreshold, String metadata, String data, String typeOfRules) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        calculateRuleSetWithComputableCharacteristicsInProject(project, typeOfUnions, consistencyThreshold, typeOfRules);

        return project.getRuleSetWithComputableCharacteristics();
    }

    public Pair<String, Resource> download(UUID id) throws IOException {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        RuleMLBuilder ruleMLBuilder = new RuleMLBuilder();

        RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = project.getRuleSetWithComputableCharacteristics();
        if(ruleSetWithComputableCharacteristics == null) {
            EmptyResponseException ex = new EmptyResponseException("Rules", id);
            logger.error(ex.getMessage());
            throw ex;
        }

        String ruleMLString = ruleMLBuilder.toRuleMLString(ruleSetWithComputableCharacteristics, 1);

        InputStream is = new ByteArrayInputStream(ruleMLString.getBytes());

        InputStreamResource resource = new InputStreamResource(is);

        return new Pair<>(project.getName(), resource);
    }
}
