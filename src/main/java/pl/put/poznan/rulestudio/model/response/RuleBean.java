package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.rules.Condition;
import org.rulelearn.rules.Rule;
import org.rulelearn.rules.RuleType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;

public class RuleBean {
    private static final Logger logger = LoggerFactory.getLogger(RuleBean.class);

    @JsonProperty("toString")
    private String stringRepresentation;

    private RuleType type;

    private ConditionBean[] conditions;

    private ConditionBean[][] decisions;

    public RuleBean(Rule rule) {
        this.stringRepresentation = rule.toString();
        this.type = rule.getType();

        Condition[] ruleConditions = rule.getConditions();
        final int numberOfConditions = ruleConditions.length;
        this.conditions = new ConditionBean[numberOfConditions];
        for(int i = 0; i < numberOfConditions; i++) {
            this.conditions[i] = new ConditionBean(ruleConditions[i]);
        }

        final Condition[][] alternativeDecisions = rule.getDecisions();
        final int numberOfAlternativeDecisions = alternativeDecisions.length;
        this.decisions = new ConditionBean[numberOfAlternativeDecisions][];
        for(int iAlt = 0; iAlt < numberOfAlternativeDecisions; iAlt++) {
            final Condition[] connectedDecisions = alternativeDecisions[iAlt];
            final int numberOfConnectedDecisions = connectedDecisions.length;
            this.decisions[iAlt] = new ConditionBean[numberOfConnectedDecisions];
            for(int iConn = 0; iConn < numberOfConnectedDecisions; iConn++) {
                this.decisions[iAlt][iConn] = new ConditionBean(connectedDecisions[iConn]);
            }
        }
    }

    public String getStringRepresentation() {
        return stringRepresentation;
    }

    public RuleType getType() {
        return type;
    }

    public ConditionBean[] getConditions() {
        return conditions;
    }

    public ConditionBean[][] getDecisions() {
        return decisions;
    }

    @Override
    public String toString() {
        return "RuleBean{" +
                "stringRepresentation='" + stringRepresentation + '\'' +
                ", type=" + type +
                ", conditions=" + Arrays.toString(conditions) +
                ", decisions=" + Arrays.toString(decisions) +
                '}';
    }
}
