package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.core.UnknownValueException;
import org.rulelearn.rules.RuleCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;
import java.util.function.Supplier;

@JsonComponent
public class RuleCharacteristicsSerializer extends JsonSerializer<RuleCharacteristics> {

    private static final Logger logger = LoggerFactory.getLogger(RuleCharacteristicsSerializer.class);

    private <T extends Number> void writeCharateristic(JsonGenerator jsonGenerator, Supplier<T> function, String fieldName) throws IOException {
        T value;

        try {
            value = function.get();
            jsonGenerator.writeFieldName(fieldName);
            if((value instanceof Double) && (Double.isInfinite((Double)value))) {
                logger.info("Value of " + fieldName + " is infinite:\t" + value);
                jsonGenerator.writeString(value.toString());
                return;
            }
            jsonGenerator.writeRawValue(value.toString());
        } catch (UnknownValueException e) {
            logger.info(e.getMessage());
        }
    }

    @Override
    public void serialize(RuleCharacteristics ruleCharacteristics, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {

        jsonGenerator.writeStartObject();

        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getSupport(), "Support");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getStrength(), "Strength");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getConfidence(), "Confidence");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getCoverageFactor(), "CoverageFactor");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getCoverage(), "Coverage");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getNegativeCoverage(), "NegativeCoverage");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getEpsilon(), "EpsilonMeasure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getEpsilonPrime(), "EpsilonPrimeMeasure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getFConfirmation(), "f-ConfirmationMeasure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getAConfirmation(), "A-ConfirmationMeasure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getZConfirmation(), "Z-ConfirmationMeasure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getLConfirmation(), "l-ConfirmationMeasure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getC1Confirmation(), "c1-ConfirmationMeasure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getSConfirmation(), "s-ConfirmationMeasure");

        jsonGenerator.writeEndObject();
    }
}
