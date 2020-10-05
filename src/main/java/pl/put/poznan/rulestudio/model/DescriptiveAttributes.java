package pl.put.poznan.rulestudio.model;

import it.unimi.dsi.fastutil.ints.IntArrayList;
import org.rulelearn.data.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.exception.WrongParameterException;

public class DescriptiveAttributes {
    private static final Logger logger = LoggerFactory.getLogger(DescriptiveAttributes.class);

    private String[] availableAttributesNames;
    private int[] availableAttributesIndices;
    private Integer currentAttribute;

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

    public String[] getAvailableAttributesNames() {
        return availableAttributesNames;
    }

    public int[] getAvailableAttributesIndices() {
        return availableAttributesIndices;
    }

    public Integer getCurrentAttribute() {
        return currentAttribute;
    }

    public void setCurrentAttribute(Integer currentAttribute) {
        if(availableAttributesNames == null) {
            currentAttribute = null;
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
}
