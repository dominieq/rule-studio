package pl.put.poznan.rulework.enums.converters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import pl.put.poznan.rulework.enums.MisclassificationMatrixType;
import pl.put.poznan.rulework.exception.WrongParameterException;

public class StringToMisclassificationMatrixType implements Converter<String, MisclassificationMatrixType> {

    private static final Logger logger = LoggerFactory.getLogger(StringToMisclassificationMatrixType.class);

    @Override
    public MisclassificationMatrixType convert(String source) {
        try {
            String snake_case = source.replaceAll("([A-Z]+)([A-Z][a-z])", "$1_$2").replaceAll("([a-z])([A-Z])", "$1_$2");
            return MisclassificationMatrixType.valueOf(snake_case.toUpperCase());
        } catch (IllegalArgumentException e) {
            WrongParameterException ex = new WrongParameterException(String.format("Given misclassification type \"%s\" is unrecognized.", source));
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}
