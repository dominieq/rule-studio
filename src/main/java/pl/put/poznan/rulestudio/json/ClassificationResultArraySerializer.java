package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.classification.ClassificationResult;
import org.rulelearn.classification.SimpleEvaluatedClassificationResult;
import org.rulelearn.data.SimpleDecision;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;

@JsonComponent
public class ClassificationResultArraySerializer extends JsonSerializer<ClassificationResult[]> {

    private static final Logger logger = LoggerFactory.getLogger(ClassificationResultArraySerializer.class);

    @Override
    public void serialize(ClassificationResult[] classificationResults, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        logger.debug("Serialization of ClassificationResult[]:\t{}", classificationResults);

        jsonGenerator.writeStartArray();

        for(ClassificationResult classificationResult : classificationResults) {
            jsonGenerator.writeStartObject();

            jsonGenerator.writeFieldName("suggestedDecision");
            EvaluationField evaluationField = ((SimpleDecision)classificationResult.getSuggestedDecision()).getEvaluation();
            jsonGenerator.writeString(evaluationField.toString());


            jsonGenerator.writeFieldName("certainty");
            if(classificationResult instanceof SimpleEvaluatedClassificationResult) {
                jsonGenerator.writeNumber(((SimpleEvaluatedClassificationResult)classificationResult).getSuggestedDecisionEvaluation());
            } else {
                jsonGenerator.writeNumber(1);
            }

            jsonGenerator.writeEndObject();
        }

        jsonGenerator.writeEndArray();

    }
}
