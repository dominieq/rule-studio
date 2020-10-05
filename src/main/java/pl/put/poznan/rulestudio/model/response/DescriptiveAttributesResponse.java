package pl.put.poznan.rulestudio.model.response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.DescriptiveAttributes;

import java.util.Arrays;

public class DescriptiveAttributesResponse {

    private String[] available;

    private String actual;

    private DescriptiveAttributesResponse() {
        //private constructor
    }

    public String[] getAvailable() {
        return available;
    }

    public String getActual() {
        return actual;
    }

    @Override
    public String toString() {
        return "DescriptiveAttributesResponse{" +
                "available=" + Arrays.toString(available) +
                ", actual='" + actual + '\'' +
                '}';
    }

    public static class DescriptiveAttributtesResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(DescriptiveAttributtesResponseBuilder.class);

        private String[] available;
        private String actual;

        public static DescriptiveAttributtesResponseBuilder newInstance() {
            return new DescriptiveAttributtesResponseBuilder();
        }

        public DescriptiveAttributtesResponseBuilder setAvailable(String[] available) {
            this.available = available;
            return this;
        }

        public DescriptiveAttributtesResponseBuilder setActual(String actual) {
            this.actual = actual;
            return this;
        }

        public DescriptiveAttributesResponse build() {
            DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse();

            descriptiveAttributesResponse.available = this.available;
            descriptiveAttributesResponse.actual = this.actual;

            return descriptiveAttributesResponse;
        }

        public DescriptiveAttributesResponse build(DescriptiveAttributes descriptiveAttributes) {
            DescriptiveAttributesResponse descriptiveAttributesResponse = new DescriptiveAttributesResponse();

            descriptiveAttributesResponse.available = descriptiveAttributes.getAvailableAttributesNames();

            if(descriptiveAttributes.getCurrentAttribute() == null) {
                descriptiveAttributesResponse.actual = null;
            } else {
                descriptiveAttributesResponse.actual = descriptiveAttributesResponse.available[descriptiveAttributes.getCurrentAttribute()];
            }

            return descriptiveAttributesResponse;
        }
    }
}
