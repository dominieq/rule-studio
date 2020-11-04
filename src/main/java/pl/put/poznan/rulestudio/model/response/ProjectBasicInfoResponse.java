package pl.put.poznan.rulestudio.model.response;

import pl.put.poznan.rulestudio.model.Project;

import java.util.UUID;

public class ProjectBasicInfoResponse {

    private UUID id;

    private String name;

    public ProjectBasicInfoResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "ProjectBasicInfoResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
