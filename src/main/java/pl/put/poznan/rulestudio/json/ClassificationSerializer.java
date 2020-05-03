package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulestudio.model.Classification;

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
        OrdinalMisclassificationMatrixSerializer.serializeMatrix(classification.getOrdinalMisclassificationMatrix(), classification.getOrderOfDecisions(), jsonGenerator);

        jsonGenerator.writeFieldName("typeOfClassifier");
        jsonGenerator.writeString(classification.getTypeOfClassifier().toString());

        jsonGenerator.writeFieldName("defaultClassificationResult");
        jsonGenerator.writeString(classification.getDefaultClassificationResult().toString());

        jsonGenerator.writeBooleanField("externalData", classification.isExternalData());

        jsonGenerator.writeEndObject();
    }
}
