package pl.put.poznan.rulestudio.app;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import pl.put.poznan.rulestudio.enums.converters.*;

@Configuration
public class RuLeStudioWebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToUnionTypeConverter());
        registry.addConverter(new StringToClassifierTypeConverter());
        registry.addConverter(new StringToDefaultClassificationResultType());
        registry.addConverter(new StringToRuleTypeConverter());
        registry.addConverter(new StringToDataFormatConverter());
        registry.addConverter(new StringToRulesFormatConverter());
        registry.addConverter(new StringToMisclassificationMatrixType());
        registry.addConverter(new StringToOrderByRuleCharacteristicConverter());
        registry.addConverter(new StringToConeTypeConverter());
    }
}
