package pl.put.poznan.rulestudio.model;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;

import java.util.ArrayList;

public class RulesWithHttpParameters implements Cloneable {
    private RuleSetWithCharacteristics ruleSet;
    private UnionType typeOfUnions;
    private Double consistencyThreshold;
    private RuleType typeOfRules;
    private boolean externalRules;
    private String errorMessage;
    private String rulesFileName;
    private Boolean isCurrentLearningData;
    private String attributesHash;
    private Boolean isCurrentAttributes;
    private ValidityRulesContainer validityRulesContainer;
    private Boolean isCoveragePresent;
    private DescriptiveAttributes descriptiveAttributes;
    private InformationTable informationTable;
  
    public RulesWithHttpParameters(RuleSetWithCharacteristics rules, String rulesFileName, Attribute[] attributes) {
        this.externalRules = true;
        this.ruleSet = rules;
        this.rulesFileName = rulesFileName;
        this.attributesHash = new InformationTable(attributes, new ArrayList<>()).getHash();
        this.isCurrentAttributes = true;
    }

    public RulesWithHttpParameters(RuleSetWithCharacteristics rules, UnionType typeOfUnions, Double consistencyThreshold, RuleType ruleType, DescriptiveAttributes descriptiveAttributes, InformationTable informationTable) {
        this.externalRules = false;
        this.ruleSet = rules;
        this.typeOfUnions = typeOfUnions;
        this.consistencyThreshold = consistencyThreshold;
        this.typeOfRules = ruleType;
        this.descriptiveAttributes = descriptiveAttributes;
        this.informationTable = informationTable;

        this.isCurrentLearningData = true;
        this.attributesHash = null;
        this.isCurrentAttributes = null;
        this.isCoveragePresent = true;
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

    public Boolean isCurrentLearningData() {
        return isCurrentLearningData;
    }

    public void setCurrentLearningData(Boolean currentLearningData) {
        isCurrentLearningData = currentLearningData;
    }

    public String getAttributesHash() {
        return attributesHash;
    }

    public void setAttributesHash(String attributesHash) {
        this.attributesHash = attributesHash;
    }

    public Boolean isCurrentAttributes() {
        return isCurrentAttributes;
    }

    public void setCurrentAttributes(Boolean currentAttributes) {
        isCurrentAttributes = currentAttributes;
    }

    public ValidityRulesContainer getValidityRulesContainer() {
        return validityRulesContainer;
    }

    public void setValidityRulesContainer(ValidityRulesContainer validityRulesContainer) {
        this.validityRulesContainer = validityRulesContainer;
    }

    public Boolean isCoveragePresent() {
        return isCoveragePresent;
    }

    public void setCoveragePresent(Boolean coveragePresent) {
        isCoveragePresent = coveragePresent;
    }

    public DescriptiveAttributes getDescriptiveAttributes() {
        return descriptiveAttributes;
    }

    public void setDescriptiveAttributes(DescriptiveAttributes descriptiveAttributes) {
        this.descriptiveAttributes = descriptiveAttributes;
    }

    public InformationTable getInformationTable() {
        return informationTable;
    }

    public void setInformationTable(InformationTable informationTable) {
        this.informationTable = informationTable;
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
                ", isCurrentLearningData=" + isCurrentLearningData +
                ", attributesHash='" + attributesHash + '\'' +
                ", validityRulesContainer=" + validityRulesContainer +
                ", isCoveragePresent=" + isCoveragePresent +
                ", descriptiveAttributes=" + descriptiveAttributes +
                ", informationTable=" + informationTable +
                '}';
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public String[] interpretFlags() {
        if ((this.isCurrentLearningData() != null) && (this.isCurrentLearningData())
                && ((!this.isExternalRules()) || ((this.isExternalRules()) && (this.isCurrentAttributes())))) {
            return null;
        } else {
            ArrayList<String> errorMessages = new ArrayList<>();

            if ((this.isExternalRules()) && (!this.isCurrentAttributes())) {
                errorMessages.add("The rule set has been uploaded with different attributes than current attributes in the DATA tab.");
            }

            if (this.isCurrentLearningData() == null) {
                errorMessages.add("Provided rule set doesn't have the learning information table hash. It can't be determined, if this rule set was generated based on the current data of the project.");
            } else if (!this.isCurrentLearningData()) {
                errorMessages.add("The learning data is different from current data in the DATA tab.");
            }

            return errorMessages.toArray(new String[0]);
        }
    }
}
