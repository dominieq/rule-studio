package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulestudio.model.Classification;

import java.io.IOException;

@JsonComponent
public class ClassificationSerializer extends JsonSerializer<Classification> {

    private static final Logger logger = LoggerFactory.getLogger(ClassificationSerializer.class);

    private void serializeDecisionArray(Decision[] decisions, JsonGenerator jsonGenerator) throws IOException {
        jsonGenerator.writeStartArray();

        for(Decision decision : decisions) {
            int attributeIndex = decision.getAttributeIndices().iterator().nextInt(); //assumption that there is only one decision attribute
            EvaluationField evaluationField = decision.getEvaluation(attributeIndex);
            jsonGenerator.writeString(evaluationField.toString());
        }

        jsonGenerator.writeEndArray();
    }

    @Override
    public void serialize(Classification classification, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("classificationResults");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(classification.getClassificationResults()));


        InformationTable informationTable = classification.getInformationTable();
        jsonGenerator.writeFieldName("informationTable");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(informationTable));

        jsonGenerator.writeFieldName("originalDecisions");
        serializeDecisionArray(informationTable.getDecisions(), jsonGenerator);


        jsonGenerator.writeFieldName("decisionsDomain");
        serializeDecisionArray(classification.getOrderOfDecisions(), jsonGenerator);

        jsonGenerator.writeFieldName("indicesOfCoveringRules");
        jsonGenerator.writeRawValue(mapper.writeValueAsString(classification.getIndicesOfCoveringRules()));

        jsonGenerator.writeFieldName("ordinalMisclassificationMatrix");
        OrdinalMisclassificationMatrixSerializer.serializeMatrix(classification.getOrdinalMisclassificationMatrix(), classification.getOrderOfDecisions(), jsonGenerator);

        jsonGenerator.writeFieldName("typeOfClassifier");
        jsonGenerator.writeString(classification.getTypeOfClassifier().toString());

        jsonGenerator.writeFieldName("defaultClassificationResult");
        jsonGenerator.writeString(classification.getDefaultClassificationResult().toString());

        jsonGenerator.writeBooleanField("externalData", classification.isExternalData());

        if(classification.getExternalDataFileName() != null) {
            jsonGenerator.writeFieldName("externalDataFileName");
            jsonGenerator.writeString(classification.getExternalDataFileName());
        }

        jsonGenerator.writeFieldName("learningDataHash");
        jsonGenerator.writeString(classification.getLearningDataHash());

        if(classification.getRuleSetHash() != null) {
            jsonGenerator.writeFieldName("ruleSetHash");
            jsonGenerator.writeString(classification.getRuleSetHash());
        }

        jsonGenerator.writeEndObject();
    }
}
