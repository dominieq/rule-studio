package pl.put.poznan.rulestudio.service;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.model.*;
import pl.put.poznan.rulestudio.model.response.ProjectResponse;
import pl.put.poznan.rulestudio.model.response.ProjectsResponse;

import java.io.IOException;
import java.util.ArrayList;

@Service
public class ProjectsService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectsService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public ProjectsResponse getProjects() {
        final ProjectsResponse projectsResponse = new ProjectsResponse(projectsContainer);
        logger.debug(projectsResponse.toString());
        return projectsResponse;
    }

    private Project createEmptyProject(String name) {
        final Project project = new Project(name);
        projectsContainer.addProject(project);
        return project;
    }

    public ProjectResponse createProject(
            String name,
            MultipartFile metadataFile,
            MultipartFile dataFile,
            MultipartFile rulesFile,
            Character separator,
            Boolean header) throws IOException {

        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("name=\"").append(name).append("\", ");
            if (metadataFile != null) sb.append("metadata={\"").append(metadataFile.getOriginalFilename()).append("\", ").append(metadataFile.getContentType()).append(", ").append(metadataFile.getSize()).append("B}, ");
            if (dataFile != null) sb.append("data={\"").append(dataFile.getOriginalFilename()).append("\", ").append(dataFile.getContentType()).append(", ").append(dataFile.getSize()).append("B}, ");
            if (rulesFile != null) sb.append("rules={\"").append(rulesFile.getOriginalFilename()).append("\", ").append(rulesFile.getContentType()).append(", ").append(rulesFile.getSize()).append("B}, ");
            sb.append("separator=\"").append(separator).append("\", ");
            sb.append("header=").append(header);
            logger.info(sb.toString());
        }

        if(metadataFile == null) {
            final ProjectResponse projectResponse = new ProjectResponse(createEmptyProject(name));
            logger.debug(projectResponse.toString());
            return projectResponse;
        }

        InformationTable informationTable = null;
        Project project;
        final Attribute[] attributes = MetadataService.attributesFromMultipartFileMetadata(metadataFile);

        if(dataFile != null) { //load data from file
            informationTable = DataService.informationTableFromMultipartFileData(dataFile, attributes, separator, header);
        } else { //there is no objects
            informationTable = new InformationTable(attributes, new ArrayList<>());
        }

        project = new Project(name, informationTable);

        project.setMetadataFileName(metadataFile.getOriginalFilename());
        if(dataFile != null)    project.setDataFileName(dataFile.getOriginalFilename());

        if(rulesFile != null) { //load rules from file
            final RuleSetWithCharacteristics ruleSetWithCharacteristics = RulesService.parseRules(rulesFile, attributes);

            project.setProjectRules(new ProjectRules(ruleSetWithCharacteristics, rulesFile.getOriginalFilename(), attributes));
        }


        projectsContainer.addProject(project);

        final ProjectResponse projectResponse = new ProjectResponse(project);
        logger.debug(projectResponse.toString());
        return projectResponse;
    }
}
