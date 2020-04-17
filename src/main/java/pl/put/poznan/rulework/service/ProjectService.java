package pl.put.poznan.rulework.service;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.exception.ProjectNotFoundException;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;
import pl.put.poznan.rulework.model.RulesWithHttpParameters;

import java.io.IOException;
import java.io.Reader;
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

        return getProjectFromProjectsContainer(projectsContainer, id);
    }

    public Project setProject(
            UUID id,
            MultipartFile metadataFile,
            MultipartFile dataFile,
            MultipartFile rulesFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Id:\t" + id);
        if(metadataFile != null)    logger.info("Metadata:\t{}\t{}", metadataFile.getOriginalFilename(), metadataFile.getContentType());
        if(dataFile != null)        logger.info("Data:\t{}\t{}", dataFile.getOriginalFilename(), dataFile.getContentType());
        if(rulesFile != null)       logger.info("Rules:\t{}\t{}", rulesFile.getOriginalFilename(), rulesFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        Project project = getProjectFromProjectsContainer(projectsContainer, id);

        if((metadataFile == null) && (dataFile == null) && (rulesFile == null)) {
            project.setInformationTable(new InformationTable(new Attribute[0], new ArrayList<>()));
            project.setRules(null);

            return project;
        }

        Reader reader;
        Attribute[] attributes;
        InformationTable informationTable = project.getInformationTable();

        if(metadataFile != null) { //load new metadata from file
            attributes = MetadataService.attributesFromMultipartFileMetadata(metadataFile);

            informationTable = new InformationTable(attributes, new ArrayList<>());
            project.setRules(null);
        }

        if(dataFile != null) { //load new data from file
            attributes = informationTable.getAttributes();
            informationTable = DataService.informationTableFromMultipartFileData(dataFile, attributes, separator, header);
        }

        if((metadataFile != null) || (dataFile != null)) { //don't use setter, when only rulesFile is provided - informationTable doesn't change
            project.setInformationTable(informationTable);
        }


        if(rulesFile != null) { //load rules from file
            attributes = informationTable.getAttributes();
            RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = RulesService.parseComputableRules(rulesFile, attributes);
            project.setRules(new RulesWithHttpParameters(ruleSetWithComputableCharacteristics, true));
        }

        return project;
    }

    public Project renameProject(UUID id, String name) {
        logger.info("Id:\t" + id);
        logger.info("Name:\t" + name);

        Project project = getProjectFromProjectsContainer(projectsContainer, id);

        project.setName(name);

        return project;
    }

    public void deleteProject(UUID id) {
        logger.info("Id:\t" + id);

        Project project = projectsContainer.removeProject(id);

        if(project == null) {
            ProjectNotFoundException ex = new ProjectNotFoundException();
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}
