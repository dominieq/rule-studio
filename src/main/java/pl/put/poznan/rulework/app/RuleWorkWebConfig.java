package pl.put.poznan.rulework.app;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import pl.put.poznan.rulework.enums.converters.*;

@Configuration
public class RuleWorkWebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToUnionTypeConverter());
        registry.addConverter(new StringToClassifierTypeConverter());
        registry.addConverter(new StringToDefaultClassificationResultType());
        registry.addConverter(new StringToRuleTypeConverter());
        registry.addConverter(new StringToRulesFormatConverter());
        registry.addConverter(new StringToMisclassificationMatrixType());
    }
}
