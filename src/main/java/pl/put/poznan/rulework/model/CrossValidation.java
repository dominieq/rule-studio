package pl.put.poznan.rulework.model;

import org.rulelearn.data.InformationTable;
import org.rulelearn.sampling.CrossValidator;

import java.util.List;
import java.util.Random;

public class CrossValidation {
    private Integer numberOfFolds;
    private List<CrossValidator.CrossValidationFold<InformationTable>> folds;

    public CrossValidation(Integer numberOfFolds, List<CrossValidator.CrossValidationFold<InformationTable>> folds) {
        this.numberOfFolds = numberOfFolds;
        this.folds = folds;
    }

    public Integer getNumberOfFolds() {
        return numberOfFolds;
    }

    public void setNumberOfFolds(Integer numberOfFolds) {
        this.numberOfFolds = numberOfFolds;
    }

    public List<CrossValidator.CrossValidationFold<InformationTable>> getFolds() {
        return folds;
    }

    public void setFolds(List<CrossValidator.CrossValidationFold<InformationTable>> folds) {
        this.folds = folds;
    }
}
