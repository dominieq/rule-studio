package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.data.Decision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulestudio.model.CrossValidation;

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

        Decision[] orderOfDecision = crossValidation.getCrossValidationSingleFolds()[0].getClassificationValidationTable().getOrderOfDecisions();

        jsonGenerator.writeFieldName("meanOrdinalMisclassificationMatrix");
        OrdinalMisclassificationMatrixSerializer.serializeMatrix(crossValidation.getMeanOrdinalMisclassificationMatrix(), orderOfDecision, jsonGenerator);

        jsonGenerator.writeFieldName("sumOrdinalMisclassificationMatrix");
        OrdinalMisclassificationMatrixSerializer.serializeMatrix(crossValidation.getSumOrdinalMisclassificationMatrix(), orderOfDecision, jsonGenerator);

        jsonGenerator.writeFieldName("typeOfUnions");
        jsonGenerator.writeString(crossValidation.getTypeOfUnions().toString());

        jsonGenerator.writeFieldName("consistencyThreshold");
        jsonGenerator.writeNumber(crossValidation.getConsistencyThreshold());

        jsonGenerator.writeFieldName("typeOfRules");
        jsonGenerator.writeString(crossValidation.getTypeOfRules().toString());

        jsonGenerator.writeFieldName("typeOfClassifier");
        jsonGenerator.writeString(crossValidation.getTypeOfClassifier().toString());

        jsonGenerator.writeFieldName("defaultClassificationResult");
        jsonGenerator.writeString(crossValidation.getDefaultClassificationResult().toString());

        jsonGenerator.writeFieldName("seed");
        jsonGenerator.writeNumber(crossValidation.getSeed());

        jsonGenerator.writeBooleanField("isCurrentData", crossValidation.isCurrentData());

        jsonGenerator.writeEndObject();
    }
}
