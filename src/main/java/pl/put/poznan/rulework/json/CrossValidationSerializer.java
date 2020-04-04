package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.data.Decision;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulework.model.CrossValidation;

import java.io.IOException;

@JsonComponent
public class CrossValidationSerializer extends JsonSerializer<CrossValidation> {

    private static final Logger logger = LoggerFactory.getLogger(CrossValidationSerializer.class);

    @Override
    public void serialize(CrossValidation crossValidation, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("Number of folds");
        jsonGenerator.writeNumber(crossValidation.getNumberOfFolds());

        jsonGenerator.writeFieldName("crossValidationSingleFolds");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(crossValidation.getCrossValidationSingleFolds()));

        jsonGenerator.writeFieldName("meanOrdinalMisclassificationMatrix");
        OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix = crossValidation.getMeanOrdinalMisclassificationMatrix();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("Deviation of accuracy");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfAccuracy());

        jsonGenerator.writeFieldName("Deviation of number objects with assigned decision");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("Deviation of number of correct assignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("Deviation of number of incorrect assignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("Deviation of number of unknown assigned decisions for unknown original decisions");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Deviation of number of unknown assignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("Deviation of number of unknown original decisions");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Number of objects with assigned decision");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("Number of correct assignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("Number of incorrect assignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("Number of unknown assigned decisions for unknown original decisions");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Number of unknown assignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("Number of unknown original decisions");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Accuracy");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getAccuracy());

        jsonGenerator.writeFieldName("gmean");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getGmean());

        jsonGenerator.writeFieldName("mae");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getMAE());

        jsonGenerator.writeFieldName("rmse");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getRMSE());

        Decision[] orderOfDecision = crossValidation.getCrossValidationSingleFolds()[0].getClassificationValidationTable().getOrderOfDecisions();

        jsonGenerator.writeFieldName("Deviation of number of unknown assigned decisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of number of unknown original decisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of true positive rate");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfTruePositiveRate(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of value");
        jsonGenerator.writeStartArray();
        for(Decision originalDecision : orderOfDecision) {
            jsonGenerator.writeStartArray();
            for(Decision assignedDecision : orderOfDecision) {
                jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfValue(originalDecision, assignedDecision));
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Number of unknown assigned decisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Number of unknown original decisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("True positive rate");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getTruePositiveRate(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("value");
        jsonGenerator.writeStartArray();
        for(Decision originalDecision : orderOfDecision) {
            jsonGenerator.writeStartArray();
            for(Decision assignedDecision : orderOfDecision) {
                jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getValue(originalDecision, assignedDecision));
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeEndObject();

        jsonGenerator.writeFieldName("typeOfUnions");
        jsonGenerator.writeString(crossValidation.getTypeOfUnions().toString());

        jsonGenerator.writeFieldName("consistencyThreshold");
        jsonGenerator.writeNumber(crossValidation.getConsistencyThreshold());

        jsonGenerator.writeFieldName("typeOfRules");
        jsonGenerator.writeString(crossValidation.getTypeOfRule().toString());

        jsonGenerator.writeFieldName("typeOfClassifier");
        jsonGenerator.writeString(crossValidation.getTypeOfClassifier().toString());

        jsonGenerator.writeFieldName("defaultClassificationResult");
        jsonGenerator.writeString(crossValidation.getDefaultClassificationResult().toString());

        jsonGenerator.writeEndObject();
    }
}
