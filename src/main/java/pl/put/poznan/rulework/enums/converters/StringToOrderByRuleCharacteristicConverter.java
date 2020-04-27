package pl.put.poznan.rulework.enums.converters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import pl.put.poznan.rulework.enums.OrderByRuleCharacteristic;
import pl.put.poznan.rulework.exception.WrongParameterException;

public class StringToOrderByRuleCharacteristicConverter implements Converter<String, OrderByRuleCharacteristic> {

    private static final Logger logger = LoggerFactory.getLogger(StringToOrderByRuleCharacteristicConverter.class);

    @Override
    public OrderByRuleCharacteristic convert(String source) {
        try {
            String snake_case = source.replaceAll("([A-Z]+)([A-Z][a-z])", "$1_$2").replaceAll("([a-z0-9])([A-Z])", "$1_$2");
            return OrderByRuleCharacteristic.valueOf(snake_case.toUpperCase());
        } catch (IllegalArgumentException e) {
            WrongParameterException ex = new WrongParameterException(String.format("Given ordered rule characteristic \"%s\" is unrecognized.", source));
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}
