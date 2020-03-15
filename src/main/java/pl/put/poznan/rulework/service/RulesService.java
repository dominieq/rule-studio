package pl.put.poznan.rulework.service;

import javafx.util.Pair;
import org.rulelearn.approximations.Union;
import org.rulelearn.approximations.Unions;
import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.approximations.VCDominanceBasedRoughSetCalculator;
import org.rulelearn.data.InformationTableWithDecisionDistributions;
import org.rulelearn.measures.dominance.EpsilonConsistencyMeasure;
import org.rulelearn.rules.*;
import org.rulelearn.rules.ruleml.RuleMLBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
public class RulesService {

    private static final Logger logger = LoggerFactory.getLogger(RulesService.class);

    @Autowired
    ProjectsContainer projectsContainer;

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

    public RuleSetWithComputableCharacteristics putRules(UUID id) {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        Unions unions = project.getUnionsWithSingleLimitingDecision();
        if(unions == null) {
            UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = new UnionsWithSingleLimitingDecision(
                    new InformationTableWithDecisionDistributions(project.getInformationTable()),
                    new VCDominanceBasedRoughSetCalculator(EpsilonConsistencyMeasure.getInstance(), 0)
            );

            project.setUnionsWithSingleLimitingDecision(unionsWithSingleLimitingDecision);
            project.setCalculatedUnionsWithSingleLimitingDecision(true);

            unions = unionsWithSingleLimitingDecision;
        }

        final RuleInductionStoppingConditionChecker stoppingConditionChecker =
                new EvaluationAndCoverageStoppingConditionChecker(
                        EpsilonConsistencyMeasure.getInstance(),
                        EpsilonConsistencyMeasure.getInstance(),
                        ((VCDominanceBasedRoughSetCalculator) unions.getRoughSetCalculator()).getLowerApproximationConsistencyThreshold()
                );

        RuleInducerComponents certainRuleInducerComponents = new CertainRuleInducerComponents.Builder().
                ruleInductionStoppingConditionChecker(stoppingConditionChecker).
                ruleConditionsPruner(new AttributeOrderRuleConditionsPruner(stoppingConditionChecker)).
                build();

        ApproximatedSetProvider unionAtLeastProvider = new UnionProvider(Union.UnionType.AT_LEAST, unions);
        ApproximatedSetProvider unionAtMostProvider = new UnionProvider(Union.UnionType.AT_MOST, unions);
        ApproximatedSetRuleDecisionsProvider unionRuleDecisionsProvider = new UnionWithSingleLimitingDecisionRuleDecisionsProvider();

        RuleSetWithComputableCharacteristics upwardCertainRules = (new VCDomLEM(certainRuleInducerComponents, unionAtLeastProvider, unionRuleDecisionsProvider)).generateRules();
        upwardCertainRules.calculateAllCharacteristics();
        RuleSetWithComputableCharacteristics downwardCertainRules = (new VCDomLEM(certainRuleInducerComponents, unionAtMostProvider, unionRuleDecisionsProvider)).generateRules();
        downwardCertainRules.calculateAllCharacteristics();

        RuleSetWithComputableCharacteristics resultSet = RuleSetWithComputableCharacteristics.join(upwardCertainRules, downwardCertainRules);
        project.setRuleSetWithComputableCharacteristics(resultSet);

        return resultSet;
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
