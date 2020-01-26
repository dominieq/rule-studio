package pl.put.poznan.rulework.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private Project getProjectFromProjectsContainer(UUID id) {
        return projectsContainer.getProjectHashMap().get(id);
    }

    private void addProjectToProjectsContainer(Project project) {
        projectsContainer.getProjectHashMap().put(project.getId(), project);
    }

    private void deleteProjectFromProjectsContainer(UUID id) {
        projectsContainer.getProjectHashMap().remove(id);
    }

    public Project getProject(UUID id) {
        logger.info("Id:\t" + id);

        return getProjectFromProjectsContainer(id);
    }

    public ArrayList<Project> getProjects() {
        return new ArrayList<Project>(projectsContainer.getProjectHashMap().values());
    }

    public Project createProject(String name) {
        logger.info("Name:\t" + name);

        Project project = new Project(name);
        addProjectToProjectsContainer(project);
        return project;
    }

    public Project renameProject(UUID id, String name) {
        logger.info("Id:\t" + id);
        logger.info("Name:\t" + name);

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }

        project.setName(name);

        return project;
    }

    public String deleteProject(UUID id) {
        logger.info("Id:\t" + id);

        deleteProjectFromProjectsContainer(id);

        return "Project deleted";
    }
}
