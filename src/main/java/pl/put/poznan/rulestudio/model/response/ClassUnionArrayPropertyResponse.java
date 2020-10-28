 package pl.put.poznan.rulestudio.model.response;

import org.rulelearn.approximations.Union;
import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.enums.ClassUnionArrayPropertyType;
import pl.put.poznan.rulestudio.model.DescriptiveAttributes;
import pl.put.poznan.rulestudio.service.UnionsService;

import java.util.Arrays;

public class ClassUnionArrayPropertyResponse {

    private String[] objectNames;

    private int[] value;

    private ClassUnionArrayPropertyResponse() {
        //private constructor
    }

    public String[] getObjectNames() {
        return objectNames;
    }

    public int[] getValue() {
        return value;
    }

    @Override
    public String toString() {
        return "ClassUnionArrayPropertyResponse{" +
                "objectNames=" + Arrays.toString(objectNames) +
                ", value=" + Arrays.toString(value) +
                '}';
    }

    public static class ClassUnionArrayPropertyResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ClassUnionArrayPropertyResponseBuilder.class);

        private String[] objectNames;
        private int[] value;

        public static ClassUnionArrayPropertyResponseBuilder newInstance() {
            return new ClassUnionArrayPropertyResponseBuilder();
        }

        public ClassUnionArrayPropertyResponseBuilder setObjectNames(String[] objectNames) {
            this.objectNames = objectNames;
            return this;
        }

        public ClassUnionArrayPropertyResponseBuilder setValue(int[] value) {
            this.value = value;
            return this;
        }

        public ClassUnionArrayPropertyResponse build() {
            ClassUnionArrayPropertyResponse classUnionArrayPropertyResponse = new ClassUnionArrayPropertyResponse();

            classUnionArrayPropertyResponse.objectNames = this.objectNames;
            classUnionArrayPropertyResponse.value = this.value;

            return classUnionArrayPropertyResponse;
        }

        public ClassUnionArrayPropertyResponse build(Union union, ClassUnionArrayPropertyType classUnionArrayPropertyType, DescriptiveAttributes descriptiveAttributes, InformationTable informationTable) {
            ClassUnionArrayPropertyResponse classUnionArrayPropertyResponse = new ClassUnionArrayPropertyResponse();

            classUnionArrayPropertyResponse.value = UnionsService.getClassUnionArrayPropertyValues(union, classUnionArrayPropertyType);
            classUnionArrayPropertyResponse.objectNames = descriptiveAttributes.extractChosenObjectNames(informationTable, classUnionArrayPropertyResponse.value);

            return classUnionArrayPropertyResponse;
        }
    }
}
