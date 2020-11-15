package pl.put.poznan.rulestudio.model;

import it.unimi.dsi.fastutil.ints.IntArrayList;
import org.rulelearn.data.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

import java.util.Arrays;

public class DescriptiveAttributes {
    private static final Logger logger = LoggerFactory.getLogger(DescriptiveAttributes.class);

    private String[] availableAttributesNames;
    private int[] availableAttributesIndices;
    private Integer currentAttribute;

    public DescriptiveAttributes() {
        availableAttributesNames = new String[0];
        availableAttributesIndices = new int[0];
        currentAttribute = null;
    }

    public DescriptiveAttributes(InformationTable informationTable) {
        IntArrayList indices = new IntArrayList();
        for(int i = 0; i < informationTable.getNumberOfAttributes(); i++) {
            Attribute attribute = informationTable.getAttribute(i);
            if((attribute instanceof IdentificationAttribute) && (attribute.isActive())) {
                indices.add(i);
            } else if(attribute instanceof EvaluationAttribute) {
                if(((EvaluationAttribute) attribute).getType() == AttributeType.DESCRIPTION) {
                    indices.add(i);
                }
            }
        }

        availableAttributesIndices = indices.toIntArray();
        availableAttributesNames = new String[indices.size()];
        for(int i = 0; i < indices.size(); i++) {
            availableAttributesNames[i] = informationTable.getAttribute(availableAttributesIndices[i]).getName();
        }

        currentAttribute = null;
    }

    public DescriptiveAttributes(DescriptiveAttributes descriptiveAttributes) {
        if(descriptiveAttributes == null) {
            availableAttributesNames = new String[0];
            availableAttributesIndices = new int[0];
            currentAttribute = null;

            return;
        }

        if(descriptiveAttributes.availableAttributesNames != null) {
            int i, length = descriptiveAttributes.availableAttributesNames.length;
            this.availableAttributesNames = new String[length];
            for(i = 0; i < length; i++) {
                this.availableAttributesNames[i] = descriptiveAttributes.availableAttributesNames[i];
            }
        } else {
            availableAttributesNames = new String[0];
        }

        if(descriptiveAttributes.availableAttributesIndices != null) {
            this.availableAttributesIndices = Arrays.copyOf(descriptiveAttributes.availableAttributesIndices, descriptiveAttributes.availableAttributesIndices.length);
        } else {
            availableAttributesIndices = new int[0];
        }

        this.currentAttribute = descriptiveAttributes.currentAttribute;
    }

    public DescriptiveAttributes(InformationTable informationTable, String currentAttribute) {
        this(informationTable);
        try {
            setCurrentAttribute(currentAttribute);
        } catch (WrongParameterException ignore) {}
    }

    public String[] getAvailableAttributesNames() {
        return availableAttributesNames;
    }

    public String getCurrentAttributeName() {
        if(currentAttribute == null) {
            return null;
        }

        if(availableAttributesNames == null) {
            return null;
        }

        return availableAttributesNames[currentAttribute];
    }

    public int[] getAvailableAttributesIndices() {
        return availableAttributesIndices;
    }

    public Integer getCurrentAttribute() {
        return currentAttribute;
    }

    public Integer getCurrentAttributeInformationTableIndex() {
        if(currentAttribute == null) {
            return null;
        }

        if(availableAttributesIndices == null) {
            return null;
        }

        return availableAttributesIndices[currentAttribute];
    }

    public void setCurrentAttribute(Integer currentAttribute) {
        if(availableAttributesNames == null) {
            this.currentAttribute = null;
            return;
        }

        if((currentAttribute < 0) || (currentAttribute >= availableAttributesNames.length)) {
            WrongParameterException ex = new WrongParameterException(String.format("Given attribute's index \"%d\" is incorrect. You can choose available attributes from %d to %d.", currentAttribute, 0, availableAttributesNames.length));
            logger.error(ex.getMessage());
            throw ex;
        }
        
        this.currentAttribute = currentAttribute;
    }

    public void setCurrentAttribute(String currentAttribute) {
        if(currentAttribute == null) {
            this.currentAttribute = null;
            return;
        }

        int i = 0;
        while(i < availableAttributesNames.length) {
            if(availableAttributesNames[i].equals(currentAttribute)) {
                this.currentAttribute = i;
                return;
            }
            i++;
        }

        WrongParameterException ex = new WrongParameterException(String.format("There is no descriptive attribute with given name \"%s\".", currentAttribute));
        logger.error(ex.getMessage());
        throw ex;
    }

    public String[] extractObjectNames(InformationTable informationTable) {
        String[] objectNames;
        final Integer attributeIndex = this.getCurrentAttributeInformationTableIndex();

        if(informationTable == null) {
            objectNames = new String[0];

            return objectNames;
        }

        objectNames = new String[informationTable.getNumberOfObjects()];
        if(attributeIndex == null) {
            String base = "Object ";
            StringBuilder sb;
            for(int objectIndex = 0; objectIndex < informationTable.getNumberOfObjects(); objectIndex++) {
                sb = new StringBuilder(base);
                sb.append(objectIndex + 1);
                objectNames[objectIndex] = sb.toString();
            }
        } else {
            for(int objectIndex = 0; objectIndex < informationTable.getNumberOfObjects(); objectIndex++) {
                objectNames[objectIndex] = informationTable.getField(objectIndex, attributeIndex).toString();
            }
        }

        return objectNames;
    }

    public String[] extractChosenObjectNames(InformationTable informationTable, int[] indices) {
        String[] objectNames;
        final Integer attributeIndex = this.getCurrentAttributeInformationTableIndex();

        if(informationTable == null) {
            objectNames = new String[0];

            return objectNames;
        }

        objectNames = new String[indices.length];
        if(attributeIndex == null) {
            String base = "Object ";
            StringBuilder sb;
            for(int i = 0; i < indices.length; i++) {
                sb = new StringBuilder(base);
                sb.append(indices[i] + 1);
                objectNames[i] = sb.toString();
            }
        } else {
            for(int i = 0; i < indices.length; i++) {
                objectNames[i] = informationTable.getField(indices[i], attributeIndex).toString();
            }
        }

        return objectNames;
    }

    @Override
    public String toString() {
        return "DescriptiveAttributes{" +
                "availableAttributesNames=" + Arrays.toString(availableAttributesNames) +
                ", availableAttributesIndices=" + Arrays.toString(availableAttributesIndices) +
                ", currentAttribute=" + currentAttribute +
                '}';
    }
}
