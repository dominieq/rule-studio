package pl.put.poznan.rulestudio.model.parameters;

public interface CrossValidationParameters {

    Integer getNumberOfFolds();

    Long getSeed();

    Boolean equalsTo(CrossValidationParameters that);
}
