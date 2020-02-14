package pl.put.poznan.rulework.model;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.UUID;

@Component
public class ProjectsContainer {
    private HashMap<UUID, Project> projectHashMap;

    public ProjectsContainer() {
        projectHashMap = new HashMap<>();
    }

    public HashMap<UUID, Project> getProjectHashMap() {
        return projectHashMap;
    }

    public void setProjectHashMap(HashMap<UUID, Project> projectHashMap) {
        this.projectHashMap = projectHashMap;
    }
}
