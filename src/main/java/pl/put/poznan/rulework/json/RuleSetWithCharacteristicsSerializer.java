package pl.put.poznan.rulework.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.rulelearn.rules.ComputableRuleCharacteristics;
import org.rulelearn.rules.RuleCharacteristics;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;

@JsonComponent
public class RuleSetWithCharacteristicsSerializer extends JsonSerializer<RuleSetWithCharacteristics> {

    private static final Logger logger = LoggerFactory.getLogger(RuleSetWithCharacteristicsSerializer.class);

    @Override
    public void serialize(RuleSetWithCharacteristics ruleSetWithCharacteristics, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        logger.debug("Serialization of RuleSetWithCharacteristics:\t{}", ruleSetWithCharacteristics);

        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();

        jsonGenerator.writeStartArray();
        for(int i = 0; i < ruleSetWithCharacteristics.size(); i++) {
            jsonGenerator.writeStartObject();

            jsonGenerator.writeFieldName("rule");
            jsonGenerator.writeRawValue(mapper.writeValueAsString(ruleSetWithCharacteristics.getRule(i)));


            RuleCharacteristics ruleCharacteristics = ruleSetWithCharacteristics.getRuleCharacteristics(i);

            jsonGenerator.writeFieldName("ruleCharacteristics");
            jsonGenerator.writeRawValue(mapper.writeValueAsString(ruleCharacteristics));

            if(ruleCharacteristics instanceof ComputableRuleCharacteristics) {
                jsonGenerator.writeFieldName("ruleCoverageInformation");
                jsonGenerator.writeRawValue(
                        mapper.writeValueAsString(
                                ((ComputableRuleCharacteristics) ruleCharacteristics).getRuleCoverageInformation()
                        )
                );
            }

            jsonGenerator.writeEndObject();
        }

        jsonGenerator.writeEndArray();
    }
}
