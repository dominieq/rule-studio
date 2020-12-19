package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import pl.put.poznan.rulestudio.model.*;

public class GlobalDescriptiveAttributesResponse extends DescriptiveAttributesResponse {

    @JsonProperty("isEverywhere")
    private Boolean isEverywhere;

    public GlobalDescriptiveAttributesResponse(Project project) {
        super(project.getDescriptiveAttributes());

        final DescriptiveAttributes globalDescriptiveAttributes = project.getDescriptiveAttributes();

        DominanceCones dominanceCones = project.getDominanceCones();
        if (dominanceCones != null) {
            if (!globalDescriptiveAttributes.hasEqualName(dominanceCones.getDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }
        }

        ProjectClassUnions projectClassUnions = project.getProjectClassUnions();
        if (projectClassUnions != null) {
            if (!globalDescriptiveAttributes.hasEqualName(projectClassUnions.getDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }
        }

        ProjectRules projectRules = project.getProjectRules();
        if (projectRules != null) {
            if (!globalDescriptiveAttributes.hasEqualName(projectRules.getDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }
        }

        ProjectClassification projectClassification = project.getProjectClassification();
        if (projectClassification != null) {
            if (!globalDescriptiveAttributes.hasEqualName(projectClassification.getClassifiedDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }

            if (!globalDescriptiveAttributes.hasEqualName(projectClassification.getLearningDescriptiveAttributes())) {
                this.isEverywhere = false;
                return;
            }
        }

        CrossValidation crossValidation = project.getCrossValidation();
        if (crossValidation != null) {
            if (!globalDescriptiveAttributes.hasEqualName(crossValidation.getDescriptiveAttributes())) {
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
