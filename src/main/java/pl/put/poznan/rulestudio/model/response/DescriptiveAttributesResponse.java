package pl.put.poznan.rulestudio.model.response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.model.DescriptiveAttributes;

import java.util.Arrays;

public class DescriptiveAttributesResponse {

    private String[] available;

    private String actual;

    public DescriptiveAttributesResponse(DescriptiveAttributes descriptiveAttributes) {
        this.available = descriptiveAttributes.getAvailableAttributesNames();

        if(descriptiveAttributes.getCurrentAttribute() == null) {
            this.actual = null;
        } else {
            this.actual = this.available[descriptiveAttributes.getCurrentAttribute()];
        }
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
}
