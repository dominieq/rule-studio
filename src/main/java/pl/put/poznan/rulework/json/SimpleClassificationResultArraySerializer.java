package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.classification.SimpleClassificationResult;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;

@JsonComponent
public class SimpleClassificationResultArraySerializer extends JsonSerializer<SimpleClassificationResult[]> {

    private static final Logger logger = LoggerFactory.getLogger(SimpleClassificationResultArraySerializer[].class);

    @Override
    public void serialize(SimpleClassificationResult[] simpleClassificationResults, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        logger.debug("Serialization of SimpleClassificationResult[]:\t{}", simpleClassificationResults);

        jsonGenerator.writeStartArray();

        for(SimpleClassificationResult simpleClassificationResult : simpleClassificationResults) {

            EvaluationField evaluationField = simpleClassificationResult.getSuggestedDecision().getEvaluation();
            jsonGenerator.writeString(evaluationField.toString());
        }

        jsonGenerator.writeEndArray();
    }
}
