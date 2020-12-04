package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonValue;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;

import java.util.ArrayList;
import java.util.Collection;

public class ProjectsResponse {

    @JsonValue
    private ArrayList<ProjectBasicInfo> projectBasicInfoArrayList;

    public ProjectsResponse(ProjectsContainer projectsContainer) {
        projectBasicInfoArrayList = new ArrayList<>();
        final Collection<Project> collection = projectsContainer.getProjectHashMap().values();
        for(Project project : collection) {
            projectBasicInfoArrayList.add(new ProjectBasicInfo(project));
        }
    }

    public ArrayList<ProjectBasicInfo> getProjectBasicInfoArrayList() {
        return projectBasicInfoArrayList;
    }

    @Override
    public String toString() {
        return "ProjectsResponse{" +
                "projectBasicInfoArrayList=" + projectBasicInfoArrayList +
                '}';
    }
}
