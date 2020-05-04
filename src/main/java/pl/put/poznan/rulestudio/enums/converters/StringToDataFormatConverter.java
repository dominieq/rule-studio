package pl.put.poznan.rulestudio.enums.converters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import pl.put.poznan.rulestudio.enums.DataFormat;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

public class StringToDataFormatConverter implements Converter<String, DataFormat> {

    private static final Logger logger = LoggerFactory.getLogger(StringToDataFormatConverter.class);

    @Override
    public DataFormat convert(String source) {
        try {
            return DataFormat.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            WrongParameterException ex = new WrongParameterException(String.format("Given format of data \"%s\" is unrecognized.", source));
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}
