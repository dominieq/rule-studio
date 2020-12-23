package pl.put.poznan.rulestudio.model;

import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import pl.put.poznan.rulestudio.model.parameters.CrossValidationParameters;

import java.util.Arrays;

public class CrossValidation {
    private InformationTable informationTable;
    private CrossValidationSingleFold[] crossValidationSingleFolds;
    private Decision[] orderOfDecisions;
    private OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix;
    private OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix;
    private CrossValidationParameters crossValidationParameters;
    private String dataHash;
    private Boolean isCurrentData;
    private DescriptiveAttributes descriptiveAttributes;
    private String calculationsTime;

    /*public CrossValidation(Integer numberOfFolds, CrossValidationSingleFold[] crossValidationSingleFolds, OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix, OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix) {
        this.numberOfFolds = numberOfFolds;
        this.crossValidationSingleFolds = crossValidationSingleFolds;
        this.meanOrdinalMisclassificationMatrix = meanOrdinalMisclassificationMatrix;
        this.sumOrdinalMisclassificationMatrix = sumOrdinalMisclassificationMatrix;
    }*/

    public CrossValidation(
            InformationTable informationTable,
            CrossValidationSingleFold[] crossValidationSingleFolds,
            Decision[] orderOfDecisions,
            OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix,
            OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix,
            CrossValidationParameters crossValidationParameters,
            String dataHash,
            String[] descriptiveAttributesPriority) {

        this.informationTable = informationTable;
        this.crossValidationSingleFolds = crossValidationSingleFolds;
        this.orderOfDecisions = orderOfDecisions;
        this.meanOrdinalMisclassificationMatrix = meanOrdinalMisclassificationMatrix;
        this.sumOrdinalMisclassificationMatrix = sumOrdinalMisclassificationMatrix;
        this.crossValidationParameters = crossValidationParameters;
        this.dataHash = dataHash;
        this.descriptiveAttributes = new DescriptiveAttributes(informationTable, descriptiveAttributesPriority);

        this.isCurrentData = true;
    }

    public InformationTable getInformationTable() {
        return informationTable;
    }

    public void setInformationTable(InformationTable informationTable) {
        this.informationTable = informationTable;
    }

    public CrossValidationSingleFold[] getCrossValidationSingleFolds() {
        return crossValidationSingleFolds;
    }

    public void setCrossValidationSingleFolds(CrossValidationSingleFold[] crossValidationSingleFolds) {
        this.crossValidationSingleFolds = crossValidationSingleFolds;
    }

    public Decision[] getOrderOfDecisions() {
        return orderOfDecisions;
    }

    public void setOrderOfDecisions(Decision[] orderOfDecisions) {
        this.orderOfDecisions = orderOfDecisions;
    }

    public OrdinalMisclassificationMatrix getMeanOrdinalMisclassificationMatrix() {
        return meanOrdinalMisclassificationMatrix;
    }

    public void setMeanOrdinalMisclassificationMatrix(OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix) {
        this.meanOrdinalMisclassificationMatrix = meanOrdinalMisclassificationMatrix;
    }

    public OrdinalMisclassificationMatrix getSumOrdinalMisclassificationMatrix() {
        return sumOrdinalMisclassificationMatrix;
    }

    public void setSumOrdinalMisclassificationMatrix(OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix) {
        this.sumOrdinalMisclassificationMatrix = sumOrdinalMisclassificationMatrix;
    }

    public CrossValidationParameters getCrossValidationParameters() {
        return crossValidationParameters;
    }

    public void setCrossValidationParameters(CrossValidationParameters crossValidationParameters) {
        this.crossValidationParameters = crossValidationParameters;
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

    public String getCalculationsTime() {
        return calculationsTime;
    }

    public void setCalculationsTime(String calculationsTime) {
        this.calculationsTime = calculationsTime;
    }

    @Override
    public String toString() {
        return "CrossValidation{" +
                "informationTable=" + informationTable +
                ", crossValidationSingleFolds=" + Arrays.toString(crossValidationSingleFolds) +
                ", orderOfDecisions=" + Arrays.toString(orderOfDecisions) +
                ", meanOrdinalMisclassificationMatrix=" + meanOrdinalMisclassificationMatrix +
                ", sumOrdinalMisclassificationMatrix=" + sumOrdinalMisclassificationMatrix +
                ", crossValidationParameters=" + crossValidationParameters +
                ", dataHash='" + dataHash + '\'' +
                ", isCurrentData=" + isCurrentData +
                ", descriptiveAttributes=" + descriptiveAttributes +
                ", calculationsTime='" + calculationsTime + '\'' +
                '}';
    }
}
