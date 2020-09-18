package pl.put.poznan.rulestudio.enums.converters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import pl.put.poznan.rulestudio.enums.ClassUnionArrayPropertyType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

public class StringToClassUnionArrayPropertyTypeConverter implements Converter<String, ClassUnionArrayPropertyType> {

    private static final Logger logger = LoggerFactory.getLogger(StringToClassUnionArrayPropertyTypeConverter.class);

    @Override
    public ClassUnionArrayPropertyType convert(String source) {
        try {
            String snake_case = source.replaceAll("([A-Z]+)([A-Z][a-z])", "$1_$2").replaceAll("([a-z])([A-Z])", "$1_$2");
            return ClassUnionArrayPropertyType.valueOf(snake_case.toUpperCase());
        } catch (IllegalArgumentException e) {
            WrongParameterException ex = new WrongParameterException(String.format("Given type of class union array property \"%s\" is unrecognized.", source));
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}
