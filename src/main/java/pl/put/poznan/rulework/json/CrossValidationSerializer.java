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

        jsonGenerator.writeFieldName("numberOfFolds");
        jsonGenerator.writeNumber(crossValidation.getNumberOfFolds());

        jsonGenerator.writeFieldName("crossValidationSingleFolds");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(crossValidation.getCrossValidationSingleFolds()));

        jsonGenerator.writeFieldName("meanOrdinalMisclassificationMatrix");
        OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix = crossValidation.getMeanOrdinalMisclassificationMatrix();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("deviationOfAccuracy");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfAccuracy());

        jsonGenerator.writeFieldName("deviationOfNumberObjectsWithAssignedDecision");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("deviationOfNumberOfCorrectAssignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("deviationOfNumberOfIncorrectAssignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("deviationOfNumberOfUnknownAssignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("deviationOfNumberOfUnknownOriginalDecisions");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("numberObjectsWithAssignedDecision");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("numberOfCorrectAssignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("numberOfIncorrectAssignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("numberOfUnknownAssignments");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("numberOfUnknownOriginalDecisions");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("accuracy");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getAccuracy());

        jsonGenerator.writeFieldName("gmean");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getGmean());

        jsonGenerator.writeFieldName("mae");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getMAE());

        jsonGenerator.writeFieldName("rmse");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getRMSE());

        jsonGenerator.writeFieldName("rmse");
        jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getRMSE());

        Decision[] orderOfDecision = crossValidation.getCrossValidationSingleFolds()[0].getClassificationValidationTable().getOrderOfDecisions();

        jsonGenerator.writeFieldName("deviationOfNumberOfUnknownAssignedDecisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("deviationOfNumberOfUnknownOriginalDecisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("deviationOfTruePositiveRate");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfTruePositiveRate(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("deviationOfValue");
        jsonGenerator.writeStartArray();
        for(Decision originalDecision : orderOfDecision) {
            jsonGenerator.writeStartArray();
            for(Decision assignedDecision : orderOfDecision) {
                jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getDeviationOfValue(originalDecision, assignedDecision));
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("numberOfUnknownAssignedDecisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("numberOfUnknownOriginalDecisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(meanOrdinalMisclassificationMatrix.getNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("truePositiveRate");
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
