package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.rulelearn.core.UnknownValueException;
import org.rulelearn.rules.RuleCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.function.Supplier;

public class RuleCharacteristicsBean {
    private static final Logger logger = LoggerFactory.getLogger(RuleCharacteristicsBean.class);

    @JsonProperty("Support")
    private Object support;

    @JsonProperty("Strength")
    private Object strength;

    @JsonProperty("Confidence")
    private Object confidence;

    @JsonProperty("Coverage factor")
    private Object coverageFactor;

    @JsonProperty("Coverage")
    private Object coverage;

    @JsonProperty("Negative coverage")
    private Object negativeCoverage;

    @JsonProperty("Epsilon measure")
    private Object epsilon;

    @JsonProperty("Epsilon prime measure")
    private Object epsilonPrime;

    @JsonProperty("f-confirmation measure")
    private Object fConfirmation;

    @JsonProperty("A-confirmation measure")
    private Object aConfirmation;

    @JsonProperty("Z-confirmation measure")
    private Object zConfirmation;

    @JsonProperty("l-confirmation measure")
    private Object lConfirmation;

    @JsonProperty("c1-confirmation measure")
    private Object c1Confirmation;

    @JsonProperty("s-confirmation measure")
    private Object sConfirmation;

    public RuleCharacteristicsBean(RuleCharacteristics ruleCharacteristics) {
        this.support = getValueOfCharacteristic(ruleCharacteristics::getSupport, "Support");
        this.strength = getValueOfCharacteristic(ruleCharacteristics::getStrength, "Strength");
        this.confidence = getValueOfCharacteristic(ruleCharacteristics::getConfidence, "Confidence");
        this.coverageFactor = getValueOfCharacteristic(ruleCharacteristics::getCoverageFactor, "Coverage factor");
        this.coverage = getValueOfCharacteristic(ruleCharacteristics::getCoverage, "Coverage");
        this.negativeCoverage = getValueOfCharacteristic(ruleCharacteristics::getNegativeCoverage, "Negative coverage");
        this.epsilon = getValueOfCharacteristic(ruleCharacteristics::getEpsilon, "Epsilon measure");
        this.epsilonPrime = getValueOfCharacteristic(ruleCharacteristics::getEpsilonPrime, "Epsilon prime measure");
        this.fConfirmation = getValueOfCharacteristic(ruleCharacteristics::getFConfirmation, "f-confirmation measure");
        this.aConfirmation = getValueOfCharacteristic(ruleCharacteristics::getAConfirmation, "A-confirmation measure");
        this.zConfirmation = getValueOfCharacteristic(ruleCharacteristics::getZConfirmation, "Z-confirmation measure");
        this.lConfirmation = getValueOfCharacteristic(ruleCharacteristics::getLConfirmation, "l-confirmation measure");
        this.c1Confirmation = getValueOfCharacteristic(ruleCharacteristics::getC1Confirmation, "c1-confirmation measure");
        this.sConfirmation = getValueOfCharacteristic(ruleCharacteristics::getSConfirmation, "s-confirmation measure");
    }

    private <T extends Number> Object getValueOfCharacteristic(Supplier<T> function, String fieldName) {
        T value;

        try {
            value = function.get();

            if((value instanceof Double) && (Double.isInfinite((Double)value))) {
                logger.debug("Value of " + fieldName + " is infinite:\t" + value);
                return value.toString();
            }

            if((value instanceof Double) && (Double.isNaN((Double)value))) {
                logger.debug("Value of " + fieldName + " is NaN:\t" + value);
                return value.toString();
            }

            if((value instanceof Double) && (value.equals(RuleCharacteristics.UNKNOWN_DOUBLE_VALUE))) {
                logger.debug("Value of " + fieldName + " is unknown:\t" + value);
                return "-";
            }

            if((value instanceof Integer) && (value.equals(RuleCharacteristics.UNKNOWN_INT_VALUE))) {
                logger.debug("Value of " + fieldName + " is unknown:\t" + value);
                return "-";
            }

            return value;
        } catch (UnknownValueException e) {
            logger.debug(e.getMessage());
            return "-";
        }
    }

    public Object getSupport() {
        return support;
    }

    public Object getStrength() {
        return strength;
    }

    public Object getConfidence() {
        return confidence;
    }

    public Object getCoverageFactor() {
        return coverageFactor;
    }

    public Object getCoverage() {
        return coverage;
    }

    public Object getNegativeCoverage() {
        return negativeCoverage;
    }

    public Object getEpsilon() {
        return epsilon;
    }

    public Object getEpsilonPrime() {
        return epsilonPrime;
    }

    public Object getfConfirmation() {
        return fConfirmation;
    }

    public Object getaConfirmation() {
        return aConfirmation;
    }

    public Object getzConfirmation() {
        return zConfirmation;
    }

    public Object getlConfirmation() {
        return lConfirmation;
    }

    public Object getC1Confirmation() {
        return c1Confirmation;
    }

    public Object getsConfirmation() {
        return sConfirmation;
    }

    @Override
    public String toString() {
        return "RuleCharacteristicsBean{" +
                "support=" + support +
                ", strength=" + strength +
                ", confidence=" + confidence +
                ", coverageFactor=" + coverageFactor +
                ", coverage=" + coverage +
                ", negativeCoverage=" + negativeCoverage +
                ", epsilon=" + epsilon +
                ", epsilonPrime=" + epsilonPrime +
                ", fConfirmation=" + fConfirmation +
                ", aConfirmation=" + aConfirmation +
                ", zConfirmation=" + zConfirmation +
                ", lConfirmation=" + lConfirmation +
                ", c1Confirmation=" + c1Confirmation +
                ", sConfirmation=" + sConfirmation +
                '}';
    }
}
