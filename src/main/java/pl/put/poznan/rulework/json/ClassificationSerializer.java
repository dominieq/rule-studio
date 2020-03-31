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

        jsonGenerator.writeFieldName("deviationOfAccuracy");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfAccuracy());

        jsonGenerator.writeFieldName("deviationOfNumberObjectsWithAssignedDecision");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("deviationOfNumberOfCorrectAssignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("deviationOfNumberOfIncorrectAssignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("deviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("deviationOfNumberOfUnknownAssignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("deviationOfNumberOfUnknownOriginalDecisions");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("numberObjectsWithAssignedDecision");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberObjectsWithAssignedDecision());

        jsonGenerator.writeFieldName("numberOfCorrectAssignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfCorrectAssignments());

        jsonGenerator.writeFieldName("numberOfIncorrectAssignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfIncorrectAssignments());

        jsonGenerator.writeFieldName("numberOfUnknownAssignedDecisionsForUnknownOriginalDecisions");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfUnknownAssignedDecisionsForUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("numberOfUnknownAssignments");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfUnknownAssignments());

        jsonGenerator.writeFieldName("numberOfUnknownOriginalDecisions");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfUnknownOriginalDecisions());

        jsonGenerator.writeFieldName("accuracy");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getAccuracy());

        jsonGenerator.writeFieldName("gmean");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getGmean());

        jsonGenerator.writeFieldName("mae");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getMAE());

        jsonGenerator.writeFieldName("rmse");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getRMSE());

        jsonGenerator.writeFieldName("rmse");
        jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getRMSE());

        jsonGenerator.writeFieldName("deviationOfNumberOfUnknownAssignedDecisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : classification.getOrderOfDecisions()) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("deviationOfNumberOfUnknownOriginalDecisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : classification.getOrderOfDecisions()) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("deviationOfTruePositiveRate");
        jsonGenerator.writeStartArray();
        for(Decision decision : classification.getOrderOfDecisions()) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfTruePositiveRate(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("deviationOfValue");
        jsonGenerator.writeStartArray();
        for(Decision originalDecision : classification.getOrderOfDecisions()) {
            jsonGenerator.writeStartArray();
            for(Decision assignedDecision : classification.getOrderOfDecisions()) {
                jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getDeviationOfValue(originalDecision, assignedDecision));
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("numberOfUnknownAssignedDecisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : classification.getOrderOfDecisions()) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfUnknownAssignedDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("numberOfUnknownOriginalDecisions");
        jsonGenerator.writeStartArray();
        for(Decision decision : classification.getOrderOfDecisions()) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getNumberOfUnknownOriginalDecisions(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("truePositiveRate");
        jsonGenerator.writeStartArray();
        for(Decision decision : classification.getOrderOfDecisions()) {
            jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getTruePositiveRate(decision));
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeFieldName("value");
        jsonGenerator.writeStartArray();
        for(Decision originalDecision : classification.getOrderOfDecisions()) {
            jsonGenerator.writeStartArray();
            for(Decision assignedDecision : classification.getOrderOfDecisions()) {
                jsonGenerator.writeNumber(ordinalMisclassificationMatrix.getValue(originalDecision, assignedDecision));
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeEndObject();

        jsonGenerator.writeFieldName("typeOfClassifier");
        jsonGenerator.writeString(classification.getTypeOfClassifier().toString());

        jsonGenerator.writeFieldName("defaultClassificationResult");
        jsonGenerator.writeString(classification.getDefaultClassificationResult().toString());

        jsonGenerator.writeEndObject();
    }
}
