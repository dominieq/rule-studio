package pl.put.poznan.rulestudio.enums.converters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import pl.put.poznan.rulestudio.enums.RulesFormat;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

public class StringToRulesFormatConverter implements Converter<String, RulesFormat> {

    private static final Logger logger = LoggerFactory.getLogger(StringToRulesFormatConverter.class);

    @Override
    public RulesFormat convert(String source) {
        try {
            return RulesFormat.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            WrongParameterException ex = new WrongParameterException(String.format("Given format of rules \"%s\" is unrecognized.", source));
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}
