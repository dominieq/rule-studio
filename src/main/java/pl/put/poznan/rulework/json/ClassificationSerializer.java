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
import pl.put.poznan.rulework.model.Classification;

import java.io.IOException;

@JsonComponent
public class ClassificationSerializer extends JsonSerializer<Classification> {

    private static final Logger logger = LoggerFactory.getLogger(ClassificationSerializer.class);

    @Override
    public void serialize(Classification classification, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("classificationResults");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(classification.getClassificationResults()));

        jsonGenerator.writeFieldName("informationTable");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(classification.getInformationTable()));

        jsonGenerator.writeFieldName("decisionsDomain");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(classification.getOrderOfDecisions()));

        jsonGenerator.writeFieldName("indicesOfCoveringRules");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(classification.getIndicesOfCoveringRules()));

        jsonGenerator.writeFieldName("ordinalMisclassificationMatrix");
        OrdinalMisclassificationMatrix ordinalMisclassificationMatrix = classification.getOrdinalMisclassificationMatrix();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("Accuracy");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getAccuracy());

        jsonGenerator.writeFieldName("Deviation of accuracy");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfAccuracy());

        jsonGenerator.writeFieldName("mae");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getMAE());

        jsonGenerator.writeFieldName("rmse");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getRMSE());

        jsonGenerator.writeFieldName("gmean");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getGmean());

        jsonGenerator.writeFieldName("Number of correct assignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("Deviation of number of correct assignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("Number of incorrect assignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("Deviation of number of incorrect assignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("Number of objects with assigned decision");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("Deviation of number objects with assigned decision");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("Number of unknown original decisions");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Deviation of number of unknown original decisions");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Number of unknown assignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("Deviation of number of unknown assignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("Number of unknown assigned decisions for unknown original decisions");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Deviation of number of unknown assigned decisions for unknown original decisions");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        Decision[] orderOfDecision = classification.getOrderOfDecisions();

        jsonGenerator.writeFieldName("True positive rate");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getTruePositiveRate(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of true positive rate");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfTruePositiveRate(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Number of unknown original decisions for a given assigned decision");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of number of unknown original decisions for a given assigned decision");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Number of unknown assigned decisions for a given original decision");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of number of unknown assigned decisions for a given original decision");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("value");
        jsonGenerator.writeStartArray();
        for(Decision originalDecision : orderOfDecision) {
            jsonGenerator.writeStartArray();
            for(Decision assignedDecision : orderOfDecision) {
                jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getValue(originalDecision, assignedDecision));
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of value");
        jsonGenerator.writeStartArray();
        for(Decision originalDecision : orderOfDecision) {
            jsonGenerator.writeStartArray();
            for(Decision assignedDecision : orderOfDecision) {
                jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfValue(originalDecision, assignedDecision));
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeEndObject();

        jsonGenerator.writeFieldName("typeOfClassifier");
        jsonGenerator.writeString(classification.getTypeOfClassifier().toString());

        jsonGenerator.writeFieldName("defaultClassificationResult");
        jsonGenerator.writeString(classification.getDefaultClassificationResult().toString());

        jsonGenerator.writeBooleanField("externalData", classification.isExternalData());

        jsonGenerator.writeEndObject();
    }
}
