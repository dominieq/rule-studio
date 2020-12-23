package pl.put.poznan.rulestudio.model;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.data.InformationTable;
import pl.put.poznan.rulestudio.model.parameters.ClassUnionsParameters;

public class ProjectClassUnions {
    private UnionsWithSingleLimitingDecision unions;
    private ClassUnionsParameters classUnionsParameters;
    private String dataHash;
    private Boolean isCurrentData;
    private DescriptiveAttributes descriptiveAttributes;
    private InformationTable informationTable;
    private String calculationsTime;

    public ProjectClassUnions(UnionsWithSingleLimitingDecision unions, ClassUnionsParameters classUnionsParameters, String dataHash, String[] descriptiveAttributesPriority, InformationTable informationTable) {
        this.unions = unions;
        this.classUnionsParameters = classUnionsParameters;
        this.dataHash = dataHash;

        this.isCurrentData = true;
        this.descriptiveAttributes = new DescriptiveAttributes(informationTable, descriptiveAttributesPriority);
        this.informationTable = informationTable;
    }

    public UnionsWithSingleLimitingDecision getUnions() {
        return unions;
    }

    public void setUnions(UnionsWithSingleLimitingDecision unions) {
        this.unions = unions;
    }

    public ClassUnionsParameters getClassUnionsParameters() {
        return classUnionsParameters;
    }

    public void setClassUnionsParameters(ClassUnionsParameters classUnionsParameters) {
        this.classUnionsParameters = classUnionsParameters;
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
        return "ProjectClassUnions{" +
                "unions=" + unions +
                ", classUnionsParameters=" + classUnionsParameters +
                ", dataHash='" + dataHash + '\'' +
                ", isCurrentData=" + isCurrentData +
                ", descriptiveAttributes=" + descriptiveAttributes +
                ", informationTable=" + informationTable +
                ", calculationsTime='" + calculationsTime + '\'' +
                '}';
    }
}
