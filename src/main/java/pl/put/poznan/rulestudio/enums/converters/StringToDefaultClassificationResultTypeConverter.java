package pl.put.poznan.rulestudio.enums.converters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

public class StringToDefaultClassificationResultTypeConverter implements Converter<String, DefaultClassificationResultType> {

    private static final Logger logger = LoggerFactory.getLogger(StringToDefaultClassificationResultTypeConverter.class);

    @Override
    public DefaultClassificationResultType convert(String source) {
        try {
            String snake_case = source.replaceAll("([A-Z]+)([A-Z][a-z])", "$1_$2").replaceAll("([a-z])([A-Z])", "$1_$2");
            return DefaultClassificationResultType.valueOf(snake_case.toUpperCase());
        } catch (IllegalArgumentException e) {
            WrongParameterException ex = new WrongParameterException(String.format("Given default classification result \"%s\" is unrecognized.", source));
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}