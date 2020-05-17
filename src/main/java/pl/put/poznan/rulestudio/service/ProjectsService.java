package pl.put.poznan.rulestudio.service;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;
import pl.put.poznan.rulestudio.model.RulesWithHttpParameters;

import java.io.IOException;
import java.util.ArrayList;

@Service
public class ProjectsService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectsService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public ArrayList<Project> getProjects() {
        ArrayList<Project> result = new ArrayList<Project>(projectsContainer.getProjectHashMap().values());

        logger.debug(result.toString());
        return result;
    }

    private Project createEmptyProject(String name) {
        Project project = new Project(name);
        projectsContainer.addProject(project);
        return project;
    }

    public Project createProject(
            String name,
            MultipartFile metadataFile,
            MultipartFile dataFile,
            MultipartFile rulesFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Name:\t{}", name);
        if(metadataFile != null)    logger.info("Metadata:\t{}\t{}", metadataFile.getOriginalFilename(), metadataFile.getContentType());
        if(dataFile != null)        logger.info("Data:\t{}\t{}", dataFile.getOriginalFilename(), dataFile.getContentType());
        if(rulesFile != null)       logger.info("Rules:\t{}\t{}", rulesFile.getOriginalFilename(), rulesFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        if(metadataFile == null) {
            return createEmptyProject(name);
        }

        InformationTable informationTable = null;
        Project project;
        Attribute[] attributes = MetadataService.attributesFromMultipartFileMetadata(metadataFile);

        if(dataFile != null) { //load data from file
            informationTable = DataService.informationTableFromMultipartFileData(dataFile, attributes, separator, header);
        } else { //there is no objects
            informationTable = new InformationTable(attributes, new ArrayList<>());
        }

        project = new Project(name, informationTable);

        project.setMetadataFileName(metadataFile.getOriginalFilename());
        if(dataFile != null)    project.setDataFileName(dataFile.getOriginalFilename());

        if(rulesFile != null) { //load rules from file
            RuleSetWithCharacteristics ruleSetWithCharacteristics = RulesService.parseRules(rulesFile, attributes);
            String ruleSetHash = ruleSetWithCharacteristics.getLearningInformationTableHash();

            project.setRules(new RulesWithHttpParameters(ruleSetWithCharacteristics, rulesFile.getOriginalFilename(), ruleSetHash));
        }


        projectsContainer.addProject(project);
        logger.debug(project.toString());
        return project;
    }
}
