package pl.put.poznan.rulestudio.service;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.exception.ProjectNotFoundException;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;
import pl.put.poznan.rulestudio.model.response.ProjectBasicInfoResponse;
import pl.put.poznan.rulestudio.model.response.ProjectDetailsResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static Project getProjectFromProjectsContainer(ProjectsContainer projectsContainer, UUID id) {
        Project project = projectsContainer.getProject(id);
        if(project == null) {
            ProjectNotFoundException ex = new ProjectNotFoundException();
            logger.error(ex.getMessage());
            throw ex;
        }

        return project;
    }

    public static InformationTable createInformationTableFromString(String metadata, String data) throws IOException {
        Attribute[] attributes = MetadataService.attributesFromStringMetadata(metadata);
        InformationTable informationTable = DataService.informationTableFromStringData(data, attributes);
        return informationTable;
    }

    public Project getProject(UUID id) {
        logger.info("Id:\t" + id);

        final Project project = getProjectFromProjectsContainer(projectsContainer, id);

        logger.debug(project.toString());
        return project;
    }

    public Project setProject(
            UUID id,
            MultipartFile metadataFile,
            MultipartFile dataFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Id:\t" + id);
        if(metadataFile != null)    logger.info("Metadata:\t{}\t{}", metadataFile.getOriginalFilename(), metadataFile.getContentType());
        if(dataFile != null)        logger.info("Data:\t{}\t{}", dataFile.getOriginalFilename(), dataFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        final Project project = getProjectFromProjectsContainer(projectsContainer, id);

        if((metadataFile == null) && (dataFile == null)) {
            project.setInformationTable(new InformationTable(new Attribute[0], new ArrayList<>()));
            project.setRules(null);

            return project;
        }

        Attribute[] attributes;
        InformationTable informationTable = project.getInformationTable();

        if(metadataFile != null) { //load new metadata from file
            attributes = MetadataService.attributesFromMultipartFileMetadata(metadataFile);

            informationTable = new InformationTable(attributes, new ArrayList<>());
            project.setRules(null);
            project.setMetadataFileName(metadataFile.getOriginalFilename());
        }

        if(dataFile != null) { //load new data from file
            attributes = informationTable.getAttributes();
            MetadataService.checkAttributes(attributes, "There is no metadata in project. Couldn't read data file.");
            informationTable = DataService.informationTableFromMultipartFileData(dataFile, attributes, separator, header);
            project.setDataFileName(dataFile.getOriginalFilename());
        }

        project.setInformationTable(informationTable);

        return project;
    }

    public ProjectBasicInfoResponse renameProject(UUID id, String name) {
        logger.info("Id:\t" + id);
        logger.info("Name:\t" + name);

        Project project = getProjectFromProjectsContainer(projectsContainer, id);

        project.setName(name);

        ProjectBasicInfoResponse projectBasicInfoResponse = new ProjectBasicInfoResponse(project);
        logger.debug(projectBasicInfoResponse.toString());
        return projectBasicInfoResponse;
    }

    public void deleteProject(UUID id) {
        logger.info("Id:\t" + id);

        final Project project = projectsContainer.removeProject(id);

        if(project == null) {
            ProjectNotFoundException ex = new ProjectNotFoundException();
            logger.error(ex.getMessage());
            throw ex;
        }
    }

    public ProjectDetailsResponse getDetails(UUID id) {
        logger.info("Id:\t" + id);

        final Project project = getProjectFromProjectsContainer(projectsContainer, id);

        ProjectDetailsResponse projectDetailsResponse = new ProjectDetailsResponse(project);
        logger.debug(projectDetailsResponse.toString());
        return projectDetailsResponse;
    }
}
