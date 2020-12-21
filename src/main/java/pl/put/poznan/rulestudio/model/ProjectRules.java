package pl.put.poznan.rulestudio.model;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import pl.put.poznan.rulestudio.model.parameters.RulesParameters;

import java.util.ArrayList;

public class ProjectRules implements Cloneable {
    private RuleSetWithCharacteristics ruleSet;
    private RulesParameters rulesParameters;
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
    private String calculationsTime;
  
    public ProjectRules(RuleSetWithCharacteristics rules, String rulesFileName, Attribute[] attributes) {
        this.externalRules = true;
        this.ruleSet = rules;
        this.rulesFileName = rulesFileName;
        this.attributesHash = new InformationTable(attributes, new ArrayList<>()).getHash();
        this.isCurrentAttributes = true;
    }

    public ProjectRules(RuleSetWithCharacteristics rules, RulesParameters rulesParameters, String[] descriptiveAttributesPriority, InformationTable informationTable) {
        this.externalRules = false;
        this.ruleSet = rules;
        this.rulesParameters = rulesParameters;
        this.descriptiveAttributes = new DescriptiveAttributes(informationTable, descriptiveAttributesPriority);
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

    public RulesParameters getRulesParameters() {
        return rulesParameters;
    }

    public void setRulesParameters(RulesParameters rulesParameters) {
        this.rulesParameters = rulesParameters;
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

    public String getCalculationsTime() {
        return calculationsTime;
    }

    public void setCalculationsTime(String calculationsTime) {
        this.calculationsTime = calculationsTime;
    }

    @Override
    public String toString() {
        return "ProjectRules{" +
                "ruleSet=" + ruleSet +
                ", rulesParameters=" + rulesParameters +
                ", externalRules=" + externalRules +
                ", errorMessage='" + errorMessage + '\'' +
                ", rulesFileName='" + rulesFileName + '\'' +
                ", isCurrentLearningData=" + isCurrentLearningData +
                ", attributesHash='" + attributesHash + '\'' +
                ", isCurrentAttributes=" + isCurrentAttributes +
                ", validityRulesContainer=" + validityRulesContainer +
                ", isCoveragePresent=" + isCoveragePresent +
                ", descriptiveAttributes=" + descriptiveAttributes +
                ", informationTable=" + informationTable +
                ", calculationsTime='" + calculationsTime + '\'' +
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
