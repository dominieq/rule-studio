package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonValue;
import pl.put.poznan.rulestudio.model.Project;

public class ProjectResponse {

    @JsonValue
    private ProjectBasicInfo projectBasicInfo;

    public ProjectResponse(Project project) {
        this.projectBasicInfo = new ProjectBasicInfo(project);
    }

    public ProjectBasicInfo getProjectBasicInfo() {
        return projectBasicInfo;
    }

    @Override
    public String toString() {
        return "ProjectResponse{" +
                "projectBasicInfo=" + projectBasicInfo +
                '}';
    }
}
