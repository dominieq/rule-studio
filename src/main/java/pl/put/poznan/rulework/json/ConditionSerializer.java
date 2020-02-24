package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.types.EnumerationField;
import org.rulelearn.types.EvaluationField;
import org.rulelearn.types.IntegerField;
import org.rulelearn.types.RealField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import org.rulelearn.rules.Condition;

import java.io.IOException;

@JsonComponent
public class ConditionSerializer extends JsonSerializer<Condition> {

    private static final Logger logger = LoggerFactory.getLogger(ConditionSerializer.class);

    @Override
    public void serialize(Condition condition, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        logger.info("Serialization of Condition:\t" + condition.toString());

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("toString");
        jsonGenerator.writeString(condition.toString());

        jsonGenerator.writeFieldName("attributeName");
        jsonGenerator.writeString(condition.getAttributeWithContext().getAttributeName());

        jsonGenerator.writeFieldName("relationSymbol");
        jsonGenerator.writeString(condition.getRelationSymbol());

        jsonGenerator.writeFieldName("limitingEvaluation");
        EvaluationField evaluationField = condition.getLimitingEvaluation();
        if(evaluationField instanceof IntegerField) {
            jsonGenerator.writeNumber(((IntegerField)evaluationField).getValue());
        } else if (evaluationField instanceof RealField) {
            jsonGenerator.writeNumber(((RealField)evaluationField).getValue());
        } else if (evaluationField instanceof EnumerationField) {
            jsonGenerator.writeString(((EnumerationField)evaluationField).getElement());
        } else {
            logger.error("Unrecognized type of EvaluationField");
        }

        jsonGenerator.writeEndObject();
    }
}
