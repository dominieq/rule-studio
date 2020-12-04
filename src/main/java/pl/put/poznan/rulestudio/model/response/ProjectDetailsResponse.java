package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectClassification;
import pl.put.poznan.rulestudio.model.RulesWithHttpParameters;

public class ProjectDetailsResponse {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String metadataFileName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String dataFileName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String rulesFileName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String externalClassifiedDataFileName;

    public ProjectDetailsResponse(Project project) {
        this.metadataFileName = project.getMetadataFileName();
        this.dataFileName = project.getDataFileName();

        RulesWithHttpParameters rules = project.getRules();
        if(rules != null) {
            this.rulesFileName = rules.getRulesFileName();
        }

        ProjectClassification projectClassification = project.getProjectClassification();
        if(projectClassification != null) {
            this.externalClassifiedDataFileName = projectClassification.getExternalDataFileName();
        }
    }

    public String getMetadataFileName() {
        return metadataFileName;
    }

    public String getDataFileName() {
        return dataFileName;
    }

    public String getRulesFileName() {
        return rulesFileName;
    }

    public String getExternalClassifiedDataFileName() {
        return externalClassifiedDataFileName;
    }

    @Override
    public String toString() {
        return "ProjectDetailsResponse{" +
                "metadataFileName='" + metadataFileName + '\'' +
                ", dataFileName='" + dataFileName + '\'' +
                ", rulesFileName='" + rulesFileName + '\'' +
                ", externalClassifiedDataFileName='" + externalClassifiedDataFileName + '\'' +
                '}';
    }
}
