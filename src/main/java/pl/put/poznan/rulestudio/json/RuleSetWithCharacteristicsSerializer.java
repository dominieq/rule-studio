package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import it.unimi.dsi.fastutil.ints.IntList;
import it.unimi.dsi.fastutil.ints.IntSet;
import org.rulelearn.rules.*;
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


            BasicRuleCoverageInformation basicRuleCoverageInformation = ruleCharacteristics.getRuleCoverageInformation();
            if(basicRuleCoverageInformation != null) {
                IntList indicesOfCoveredObjects = basicRuleCoverageInformation.getIndicesOfCoveredObjects();
                IntSet indicesOfCoveredNotSupportingObjects = basicRuleCoverageInformation.getIndicesOfCoveredNotSupportingObjects();

                jsonGenerator.writeFieldName("indicesOfCoveredObjects");
                jsonGenerator.writeRawValue(mapper.writeValueAsString(indicesOfCoveredObjects));

                int numberOfCoveredObjects = indicesOfCoveredObjects.size();
                boolean[] isSupportingObject = new boolean[numberOfCoveredObjects];
                for(int j = 0; j < numberOfCoveredObjects; j++) {
                    if(indicesOfCoveredNotSupportingObjects.contains( indicesOfCoveredObjects.getInt(j) )) {
                        isSupportingObject[j] = false;
                    } else {
                        isSupportingObject[j] = true;
                    }
                }

                jsonGenerator.writeFieldName("isSupportingObject");
                jsonGenerator.writeRawValue(mapper.writeValueAsString(isSupportingObject));
            }


            jsonGenerator.writeEndObject();
        }

        jsonGenerator.writeEndArray();
    }
}
