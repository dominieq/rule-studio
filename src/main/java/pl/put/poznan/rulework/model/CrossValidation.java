package pl.put.poznan.rulework.model;

import org.rulelearn.data.InformationTable;
import org.rulelearn.sampling.CrossValidator;
import org.rulelearn.sampling.CrossValidator.CrossValidationFold;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Random;

public class CrossValidation {
    private Integer numberOfFolds;
    private CrossValidationSingleFold crossValidationSingleFolds[];

    public CrossValidation(Integer numberOfFolds, CrossValidationSingleFold[] crossValidationSingleFolds) {
        this.numberOfFolds = numberOfFolds;
        this.crossValidationSingleFolds = crossValidationSingleFolds;
    }

    public Integer getNumberOfFolds() {
        return numberOfFolds;
    }

    public void setNumberOfFolds(Integer numberOfFolds) {
        this.numberOfFolds = numberOfFolds;
    }

    public CrossValidationSingleFold[] getCrossValidationSingleFolds() {
        return crossValidationSingleFolds;
    }

    public void setCrossValidationSingleFolds(CrossValidationSingleFold[] crossValidationSingleFolds) {
        this.crossValidationSingleFolds = crossValidationSingleFolds;
    }
}
