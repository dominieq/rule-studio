package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import pl.put.poznan.rulestudio.model.*;

public class GlobalDescriptiveAttributesResponse extends DescriptiveAttributesResponse {

    @JsonProperty("isEverywhere")
    private Boolean isEverywhere;

    public GlobalDescriptiveAttributesResponse(Project project) {
        super(project.getDescriptiveAttributes());

        final DescriptiveAttributes globaDescriptiveAttributes = project.getDescriptiveAttributes();

        DominanceCones dominanceCones = project.getDominanceCones();
        if (dominanceCones != null) {
            if (!globaDescriptiveAttributes.hasEqualName(dominanceCones.getDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }
        }

        UnionsWithHttpParameters unions = project.getUnions();
        if (unions != null) {
            if (!globaDescriptiveAttributes.hasEqualName(unions.getDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }
        }

        RulesWithHttpParameters rules = project.getRules();
        if (rules != null) {
            if (!globaDescriptiveAttributes.hasEqualName(rules.getDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }
        }

        ProjectClassification projectClassification = project.getProjectClassification();
        if (projectClassification != null) {
            if (!globaDescriptiveAttributes.hasEqualName(projectClassification.getClassifiedDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }

            if (!globaDescriptiveAttributes.hasEqualName(projectClassification.getLearningDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }
        }

        CrossValidation crossValidation = project.getCrossValidation();
        if (crossValidation != null) {
            if (!globaDescriptiveAttributes.hasEqualName(crossValidation.getDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }
        }

        this.isEverywhere = true;
    }

    @JsonIgnore
    public Boolean getEverywhere() {
        return isEverywhere;
    }

    @Override
    public String toString() {
        return "GlobalDescriptiveAttributesResponse{" +
                "isEverywhere=" + isEverywhere +
                "} " + super.toString();
    }
}
