package pl.put.poznan.rulestudio.enums.converters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

public class StringToUnionTypeConverter implements Converter<String, UnionType> {

    private static final Logger logger = LoggerFactory.getLogger(StringToUnionTypeConverter.class);

    @Override
    public UnionType convert(String source) {
        try {
            return UnionType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            WrongParameterException ex = new WrongParameterException(String.format("Given type of unions \"%s\" is unrecognized.", source));
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}
