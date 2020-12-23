package pl.put.poznan.rulestudio.model;

import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import pl.put.poznan.rulestudio.model.parameters.ClassificationParameters;

public class FoldClassification extends AbstractClassification {

    public FoldClassification(InformationTable learningInformationTable, InformationTable classifiedInformationTable, ClassificationParameters classificationParameters, RuleSetWithCharacteristics ruleSetWithCharacteristics, Decision[] orderOfDecisions) {
        classify(learningInformationTable, classifiedInformationTable, classificationParameters, ruleSetWithCharacteristics, orderOfDecisions);
    }

    @Override
    public String toString() {
        return "FoldClassification{} " + super.toString();
    }
}
