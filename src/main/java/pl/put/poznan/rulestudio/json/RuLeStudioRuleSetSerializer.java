package pl.put.poznan.rulestudio.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jackson.JsonComponent;
import pl.put.poznan.rulestudio.model.RuLeStudioRuleSet;

import java.io.IOException;

@JsonComponent
public class RuLeStudioRuleSetSerializer extends JsonSerializer<RuLeStudioRuleSet> {

    private static final Logger logger = LoggerFactory.getLogger(RuLeStudioRuleSetSerializer.class);

    @Override
    public void serialize(RuLeStudioRuleSet ruLeStudioRuleSet, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        logger.debug("Serialization of RuLeStudioRuleSet:\t{}", ruLeStudioRuleSet);

        ObjectMapper mapper = (ObjectMapper) jsonGenerator.getCodec();
        jsonGenerator.writeRawValue(mapper.writeValueAsString(ruLeStudioRuleSet.getRuLeStudioRules()));
    }
}
