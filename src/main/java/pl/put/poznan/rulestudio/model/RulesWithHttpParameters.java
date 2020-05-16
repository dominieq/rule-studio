package pl.put.poznan.rulestudio.model;

import org.rulelearn.rules.RuleSetWithCharacteristics;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;

public class RulesWithHttpParameters implements Cloneable {
    private RuleSetWithCharacteristics ruleSet;
    private UnionType typeOfUnions;
    private Double consistencyThreshold;
    private RuleType typeOfRules;
    private boolean externalRules;
    private String errorMessage;
    private String rulesFileName;
    private String dataHash;
    private Boolean isCurrentData;
    private ValidityRulesContainer validityRulesContainer;
  
    public RulesWithHttpParameters(RuleSetWithCharacteristics rules, String errorMessage, String rulesFileName, String dataHash, Boolean isCurrentData) {
        this.externalRules = true;
        this.ruleSet = rules;
        this.errorMessage = errorMessage;
        this.rulesFileName = rulesFileName;
        this.dataHash = dataHash;
        this.isCurrentData = isCurrentData;
    }

    public RulesWithHttpParameters(RuleSetWithCharacteristics rules, UnionType typeOfUnions, Double consistencyThreshold, RuleType ruleType, String dataHash) {
        this.externalRules = false;
        this.ruleSet = rules;
        this.typeOfUnions = typeOfUnions;
        this.consistencyThreshold = consistencyThreshold;
        this.typeOfRules = ruleType;
        this.dataHash = dataHash;

        this.isCurrentData = true;
    }

    public RuleSetWithCharacteristics getRuleSet() {
        return ruleSet;
    }

    public void setRuleSet(RuleSetWithCharacteristics ruleSet) {
        this.ruleSet = ruleSet;
    }

    public UnionType getTypeOfUnions() {
        return typeOfUnions;
    }

    public void setTypeOfUnions(UnionType typeOfUnions) {
        this.typeOfUnions = typeOfUnions;
    }

    public Double getConsistencyThreshold() {
        return consistencyThreshold;
    }

    public void setConsistencyThreshold(Double consistencyThreshold) {
        this.consistencyThreshold = consistencyThreshold;
    }

    public RuleType getTypeOfRules() {
        return typeOfRules;
    }

    public void setTypeOfRules(RuleType typeOfRules) {
        this.typeOfRules = typeOfRules;
    }

    public boolean isExternalRules() {
        return externalRules;
    }

    public void setExternalRules(boolean externalRules) {
        this.externalRules = externalRules;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getRulesFileName() {
        return rulesFileName;
    }

    public void setRulesFileName(String rulesFileName) {
        this.rulesFileName = rulesFileName;
    }

    public String getDataHash() {
        return dataHash;
    }

    public void setDataHash(String dataHash) {
        this.dataHash = dataHash;
    }

    public Boolean isCurrentData() {
        return isCurrentData;
    }

    public void setCurrentData(Boolean currentData) {
        isCurrentData = currentData;
    }

    public ValidityRulesContainer getValidityRulesContainer() {
        return validityRulesContainer;
    }

    public void setValidityRulesContainer(ValidityRulesContainer validityRulesContainer) {
        this.validityRulesContainer = validityRulesContainer;
    }

    @Override
    public String toString() {
        return "RulesWithHttpParameters{" +
                "ruleSet=" + ruleSet +
                ", typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                ", typeOfRules=" + typeOfRules +
                ", externalRules=" + externalRules +
                ", errorMessage='" + errorMessage + '\'' +
                ", rulesFileName='" + rulesFileName + '\'' +
                ", dataHash='" + dataHash + '\'' +
                ", isCurrentData=" + isCurrentData +
                ", validityRulesContainer=" + validityRulesContainer +
                '}';
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
