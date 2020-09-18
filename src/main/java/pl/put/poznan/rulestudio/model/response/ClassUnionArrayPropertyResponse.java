package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonValue;
import org.rulelearn.approximations.Union;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.enums.ClassUnionArrayPropertyType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

import java.util.Arrays;

public class ClassUnionArrayPropertyResponse {

    @JsonValue
    private int[] value;

    private ClassUnionArrayPropertyResponse() {
        //private constructor
    }

    public int[] getValue() {
        return value;
    }

    @Override
    public String toString() {
        return "ClassUnionArrayPropertyResponse{" +
                "value=" + value +
                '}';
    }

    public static class ClassUnionArrayPropertyResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ClassUnionArrayPropertyResponseBuilder.class);

        private int[] value;

        public static ClassUnionArrayPropertyResponseBuilder newInstance() {
            return new ClassUnionArrayPropertyResponseBuilder();
        }

        public ClassUnionArrayPropertyResponseBuilder setValue(int[] value) {
            this.value = value;
            return this;
        }

        public ClassUnionArrayPropertyResponse build() {
            ClassUnionArrayPropertyResponse classUnionArrayPropertyResponse = new ClassUnionArrayPropertyResponse();

            classUnionArrayPropertyResponse.value = this.value;

            return classUnionArrayPropertyResponse;
        }

        public ClassUnionArrayPropertyResponse build(Union union, ClassUnionArrayPropertyType classUnionArrayPropertyType) {
            ClassUnionArrayPropertyResponse classUnionArrayPropertyResponse = new ClassUnionArrayPropertyResponse();

            switch (classUnionArrayPropertyType) {
                case OBJECTS:
                    classUnionArrayPropertyResponse.value = union.getObjects().toIntArray();
                    break;
                case LOWER_APPROXIMATION:
                    classUnionArrayPropertyResponse.value = union.getLowerApproximation().toIntArray();
                    break;
                case UPPER_APPROXIMATION:
                    classUnionArrayPropertyResponse.value = union.getUpperApproximation().toIntArray();
                    break;
                case BOUNDARY:
                    classUnionArrayPropertyResponse.value = union.getBoundary().toIntArray();
                    break;
                case POSITIVE_REGION:
                    classUnionArrayPropertyResponse.value = union.getPositiveRegion().toIntArray();
                    Arrays.sort(classUnionArrayPropertyResponse.value);
                    break;
                case NEGATIVE_REGION:
                    classUnionArrayPropertyResponse.value = union.getNegativeRegion().toIntArray();
                    Arrays.sort(classUnionArrayPropertyResponse.value);
                    break;
                case BOUNDARY_REGION:
                    classUnionArrayPropertyResponse.value = union.getBoundaryRegion().toIntArray();
                    Arrays.sort(classUnionArrayPropertyResponse.value);
                    break;
                default:
                    WrongParameterException ex = new WrongParameterException(String.format("Given type of class union array property \"%s\" is unrecognized.", classUnionArrayPropertyType));
                    logger.error(ex.getMessage());
                    throw ex;
            }

            return classUnionArrayPropertyResponse;
        }
    }
}
