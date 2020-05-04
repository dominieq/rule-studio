package pl.put.poznan.rulestudio.enums.converters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

public class StringToRuleTypeConverter implements Converter<String, RuleType> {

    private static final Logger logger = LoggerFactory.getLogger(StringToRuleTypeConverter.class);

    @Override
    public RuleType convert(String source) {
        try {
            return RuleType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            WrongParameterException ex = new WrongParameterException(String.format("Given type of rules \"%s\" is unrecognized.", source));
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}
