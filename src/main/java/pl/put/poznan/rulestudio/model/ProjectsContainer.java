package pl.put.poznan.rulestudio.model;

import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.UUID;

@Component
public class ProjectsContainer {
    private LinkedHashMap<UUID, Project> projectHashMap;

    public ProjectsContainer() {
        projectHashMap = new LinkedHashMap<>();
    }

    public LinkedHashMap<UUID, Project> getProjectHashMap() {
        return projectHashMap;
    }

    public void setProjectHashMap(LinkedHashMap<UUID, Project> projectHashMap) {
        this.projectHashMap = projectHashMap;
    }

    public void addProject(Project project) {
        projectHashMap.put(project.getId(), project);
    }

    public Project getProject(UUID id) {
        return projectHashMap.get(id);
    }

    public Project removeProject(UUID id) {
        return projectHashMap.remove(id);
    }
}
