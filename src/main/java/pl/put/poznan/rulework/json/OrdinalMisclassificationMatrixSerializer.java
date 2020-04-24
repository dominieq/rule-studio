package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import org.rulelearn.data.Decision;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class OrdinalMisclassificationMatrixSerializer {

    private static final Logger logger = LoggerFactory.getLogger(OrdinalMisclassificationMatrixSerializer.class);

    public static void serializeMatrix(OrdinalMisclassificationMatrix matrix, Decision[] orderOfDecision, JsonGenerator jsonGenerator) throws IOException {
        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("Accuracy");
        jsonGenerator.writeNumber(matrix.getAccuracy());

        jsonGenerator.writeFieldName("Deviation of accuracy");
        jsonGenerator.writeNumber(matrix.getDeviationOfAccuracy());

        jsonGenerator.writeFieldName("mae");
        jsonGenerator.writeNumber(matrix.getMAE());

        jsonGenerator.writeFieldName("rmse");
        jsonGenerator.writeNumber(matrix.getRMSE());

        jsonGenerator.writeFieldName("gmean");
        jsonGenerator.writeNumber(matrix.getGmean());

        jsonGenerator.writeFieldName("Number of correct assignments");
        jsonGenerator.writeNumber(matrix.getNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("Deviation of number of correct assignments");
        jsonGenerator.writeNumber(matrix.getDeviationOfNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("Number of incorrect assignments");
        jsonGenerator.writeNumber(matrix.getNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("Deviation of number of incorrect assignments");
        jsonGenerator.writeNumber(matrix.getDeviationOfNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("Number of objects with assigned decision");
        jsonGenerator.writeNumber(matrix.getNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("Deviation of number objects with assigned decision");
        jsonGenerator.writeNumber(matrix.getDeviationOfNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("Number of unknown original decisions");
        jsonGenerator.writeNumber(matrix.getNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Deviation of number of unknown original decisions");
        jsonGenerator.writeNumber(matrix.getDeviationOfNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Number of unknown assignments");
        jsonGenerator.writeNumber(matrix.getNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("Deviation of number of unknown assignments");
        jsonGenerator.writeNumber(matrix.getDeviationOfNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("Number of unknown assigned decisions for unknown original decisions");
        jsonGenerator.writeNumber(matrix.getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Deviation of number of unknown assigned decisions for unknown original decisions");
        jsonGenerator.writeNumber(matrix.getDeviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("True positive rate");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(matrix.getTruePositiveRate(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of true positive rate");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(matrix.getDeviationOfTruePositiveRate(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Number of unknown original decisions for a given assigned decision");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(matrix.getNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of number of unknown original decisions for a given assigned decision");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(matrix.getDeviationOfNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Number of unknown assigned decisions for a given original decision");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(matrix.getNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of number of unknown assigned decisions for a given original decision");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(matrix.getDeviationOfNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("value");
        jsonGenerator.writeStartArray();
        for(Decision originalDecision : orderOfDecision) {
            jsonGenerator.writeStartArray();
            for(Decision assignedDecision : orderOfDecision) {
                jsonGenerator.writeNumber(matrix.getValue(originalDecision, assignedDecision));
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Deviation of value");
        jsonGenerator.writeStartArray();
        for(Decision originalDecision : orderOfDecision) {
            jsonGenerator.writeStartArray();
            for(Decision assignedDecision : orderOfDecision) {
                jsonGenerator.writeNumber(matrix.getDeviationOfValue(originalDecision, assignedDecision));
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeEndObject();
    }

    public static void serializeMatrixWithoutDeviation(OrdinalMisclassificationMatrix matrix, Decision[] orderOfDecision, JsonGenerator jsonGenerator) throws IOException {
        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("Accuracy");
        jsonGenerator.writeNumber(matrix.getAccuracy());

        jsonGenerator.writeFieldName("mae");
        jsonGenerator.writeNumber(matrix.getMAE());

        jsonGenerator.writeFieldName("rmse");
        jsonGenerator.writeNumber(matrix.getRMSE());

        jsonGenerator.writeFieldName("gmean");
        jsonGenerator.writeNumber(matrix.getGmean());

        jsonGenerator.writeFieldName("Number of correct assignments");
        jsonGenerator.writeNumber(matrix.getNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("Number of incorrect assignments");
        jsonGenerator.writeNumber(matrix.getNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("Number of objects with assigned decision");
        jsonGenerator.writeNumber(matrix.getNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("Number of unknown original decisions");
        jsonGenerator.writeNumber(matrix.getNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("Number of unknown assignments");
        jsonGenerator.writeNumber(matrix.getNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("Number of unknown assigned decisions for unknown original decisions");
        jsonGenerator.writeNumber(matrix.getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("True positive rate");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(matrix.getTruePositiveRate(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Number of unknown original decisions for a given assigned decision");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(matrix.getNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("Number of unknown assigned decisions for a given original decision");
        jsonGenerator.writeStartArray();
        for(Decision decision : orderOfDecision) {
            jsonGenerator.writeNumber(matrix.getNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("value");
        jsonGenerator.writeStartArray();
        for(Decision originalDecision : orderOfDecision) {
            jsonGenerator.writeStartArray();
            for(Decision assignedDecision : orderOfDecision) {
                jsonGenerator.writeNumber(matrix.getValue(originalDecision, assignedDecision));
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeEndObject();
    }
}
