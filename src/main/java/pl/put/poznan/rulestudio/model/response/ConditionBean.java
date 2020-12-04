package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.rules.Condition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConditionBean {
    private static final Logger logger = LoggerFactory.getLogger(ConditionBean.class);

    @JsonProperty("toString")
    private String stringRepresentation;

    private String attributeName;

    private String relationSymbol;

    private String limitingEvaluation;

    public ConditionBean(Condition condition) {
        this.stringRepresentation = condition.toString();
        this.attributeName = condition.getAttributeWithContext().getAttributeName();
        this.relationSymbol = condition.getRelationSymbol();
        this.limitingEvaluation = condition.getLimitingEvaluation().toString();
    }

    public String getStringRepresentation() {
        return stringRepresentation;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public String getRelationSymbol() {
        return relationSymbol;
    }

    public String getLimitingEvaluation() {
        return limitingEvaluation;
    }

    @Override
    public String toString() {
        return "ConditionBean{" +
                "stringRepresentation='" + stringRepresentation + '\'' +
                ", attributeName='" + attributeName + '\'' +
                ", relationSymbol='" + relationSymbol + '\'' +
                ", limitingEvaluation='" + limitingEvaluation + '\'' +
                '}';
    }
}
