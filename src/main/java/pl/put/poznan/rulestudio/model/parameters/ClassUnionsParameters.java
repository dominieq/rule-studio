package pl.put.poznan.rulestudio.model.parameters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.model.UnionsWithHttpParameters;

public class ClassUnionsParameters {

    private static final Logger logger = LoggerFactory.getLogger(ClassUnionsParameters.class);

    private UnionType typeOfUnions;

    private Double consistencyThreshold;

    private ClassUnionsParameters() {
        //private constructor
    }

    public UnionType getTypeOfUnions() {
        return typeOfUnions;
    }

    public Double getConsistencyThreshold() {
        return consistencyThreshold;
    }

    @Override
    public String toString() {
        return "ClassUnionsParameters{" +
                "typeOfUnions=" + typeOfUnions +
                ", consistencyThreshold=" + consistencyThreshold +
                '}';
    }

    public static class ClassUnionsParametersBuilder {
        private UnionType typeOfUnions;
        private Double consistencyThreshold;

        public static ClassUnionsParametersBuilder newInstance() {
            return new ClassUnionsParametersBuilder();
        }

        public ClassUnionsParametersBuilder setTypeOfUnions(UnionType typeOfUnions) {
            this.typeOfUnions = typeOfUnions;
            return this;
        }

        public ClassUnionsParametersBuilder setConsistencyThreshold(Double consistencyThreshold) {
            this.consistencyThreshold = consistencyThreshold;
            return this;
        }

        public ClassUnionsParameters build() {
            ClassUnionsParameters classUnionsParameters = new ClassUnionsParameters();

            classUnionsParameters.typeOfUnions = this.typeOfUnions;
            classUnionsParameters.consistencyThreshold = this.consistencyThreshold;

            return classUnionsParameters;
        }

        public ClassUnionsParameters build(UnionsWithHttpParameters unionsWithHttpParameters) {
            ClassUnionsParameters classUnionsParameters = new ClassUnionsParameters();

            classUnionsParameters.typeOfUnions = unionsWithHttpParameters.getTypeOfUnions();
            classUnionsParameters.consistencyThreshold = unionsWithHttpParameters.getConsistencyThreshold();

            return classUnionsParameters;
        }
    }
}
