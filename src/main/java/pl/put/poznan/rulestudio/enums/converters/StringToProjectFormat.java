package pl.put.poznan.rulestudio.enums.converters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import pl.put.poznan.rulestudio.enums.ProjectFormat;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

public class StringToProjectFormat implements Converter<String, ProjectFormat> {

    private static final Logger logger = LoggerFactory.getLogger(StringToProjectFormat.class);

    @Override
    public ProjectFormat convert(String source) {
        try {
            return ProjectFormat.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            WrongParameterException ex = new WrongParameterException(String.format("Given format of project \"%s\" is unrecognized.", source));
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}
