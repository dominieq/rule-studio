package pl.put.poznan.rulework.model;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProjectsContainer {
    private List<Project> projectArray;

    public ProjectsContainer() {
        projectArray = new ArrayList<>();
    }

    public List<Project> getProjectArray() {
        return projectArray;
    }

    public void setProjectArray(List<Project> projectArray) {
        this.projectArray = projectArray;
    }
}
