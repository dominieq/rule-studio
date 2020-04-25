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
                logger.warn("Value of " + fieldName + " is infinite:\t" + value);
                jsonGenerator.writeString(value.toString());
                return;
            }

            if((value instanceof Double) && (Double.isNaN((Double)value))) {
                logger.warn("Value of " + fieldName + " is NaN:\t" + value);
                jsonGenerator.writeString(value.toString());
                return;
            }

            if((value instanceof Double) && (value.equals(Double.MAX_VALUE))) {
                logger.warn("Value of " + fieldName + " is unknown:\t" + value);
                jsonGenerator.writeString("-");
                return;
            }

            if((value instanceof Integer) && (value.equals(Integer.MIN_VALUE))) {
                logger.warn("Value of " + fieldName + " is unknown:\t" + value);
                jsonGenerator.writeString("-");
                return;
            }

            jsonGenerator.writeRawValue(value.toString());
        } catch (UnknownValueException e) {
            logger.warn(e.getMessage());
            jsonGenerator.writeFieldName(fieldName);
            jsonGenerator.writeString("-");
        }
    }

    @Override
    public void serialize(RuleCharacteristics ruleCharacteristics, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {

        jsonGenerator.writeStartObject();

        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getSupport(), "Support");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getStrength(), "Strength");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getConfidence(), "Confidence");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getCoverageFactor(), "Coverage factor");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getCoverage(), "Coverage");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getNegativeCoverage(), "Negative coverage");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getEpsilon(), "Epsilon measure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getEpsilonPrime(), "Epsilon prime measure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getFConfirmation(), "f-confirmation measure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getAConfirmation(), "A-confirmation measure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getZConfirmation(), "Z-confirmation measure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getLConfirmation(), "l-confirmation measure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getC1Confirmation(), "c1-confirmation measure");
        writeCharateristic(jsonGenerator, () -> ruleCharacteristics.getSConfirmation(), "s-confirmation measure");

        jsonGenerator.writeEndObject();
    }
}
