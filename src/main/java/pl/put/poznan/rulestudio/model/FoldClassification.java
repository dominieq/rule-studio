package pl.put.poznan.rulestudio.model;

import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;

public class FoldClassification extends AbstractClassification {

    public FoldClassification(InformationTable learningInformationTable, InformationTable classifiedInformationTable, ClassifierType typeOfClassifier, DefaultClassificationResultType typeOfDefaultClassificationResult, RuleSetWithCharacteristics ruleSetWithCharacteristics, Decision[] orderOfDecisions) {
        classify(learningInformationTable, classifiedInformationTable, typeOfClassifier, typeOfDefaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);
    }

    @Override
    public String toString() {
        return "FoldClassification{} " + super.toString();
    }
}
