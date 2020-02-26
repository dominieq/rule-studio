package pl.put.poznan.rulework.service;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.EvaluationAttribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.Table;
import org.rulelearn.data.csv.ObjectParser;
import org.rulelearn.data.json.AttributeParser;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
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

    public Project createProject(String name) {
        logger.info("Name:\t" + name);

        Project project = new Project(name);
        addProjectToProjectsContainer(project);
        return project;
    }

    private Project setEmptyProject(UUID id) {

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }

        project.setInformationTable(new InformationTable(new Attribute[0], new ArrayList<>()));

        return project;
    }

    public Project setProjectWithMetadata(UUID id, MultipartFile metadataFile) throws IOException {

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }

        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        Reader reader = new InputStreamReader(metadataFile.getInputStream());
        attributes = attributeParser.parseAttributes(reader);
        for(int i = 0; i < attributes.length; i++) {
            logger.info(i + ":\t" + attributes[i]);
        }

        InformationTable informationTable = new InformationTable(attributes, new ArrayList<>());

        project.setInformationTable(informationTable);
        logger.info(project.toString());


        Table<EvaluationAttribute, EvaluationField> table = informationTable.getActiveConditionAttributeFields();
        for(int i = 0; i < table.getNumberOfObjects(); i++) {
            StringBuilder sb = new StringBuilder();
            sb.append(i);
            sb.append(":");
            for(int j = 0; j < table.getNumberOfAttributes(); j++) {
                sb.append("\t");
                sb.append(table.getField(i, j));
            }
            logger.trace(sb.toString());
        }

        return project;
    }

    public Project setProjectWithData(UUID id, MultipartFile metadataFile, MultipartFile dataFile) throws IOException {

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }

        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        Reader reader = new InputStreamReader(metadataFile.getInputStream());
        attributes = attributeParser.parseAttributes(reader);
        for(int i = 0; i < attributes.length; i++) {
            logger.info(i + ":\t" + attributes[i]);
        }

        InformationTable informationTable = null;

        if (dataFile.getContentType().equals("application/json")) {
            logger.info("Data type is json");
            org.rulelearn.data.json.ObjectParser objectParser = new org.rulelearn.data.json.ObjectParser.Builder(attributes).build();
            reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = objectParser.parseObjects(reader);

        } else if (dataFile.getContentType().equals("application/vnd.ms-excel")) {
            logger.info("Data type is csv");
            ObjectParser objectParser = new ObjectParser.Builder(attributes).build();
            reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = objectParser.parseObjects(reader);
        } else {
            logger.error("Unrecognized format of data file: " + dataFile.getContentType());
        }

        project.setInformationTable(informationTable);
        logger.info(project.toString());


        Table<EvaluationAttribute, EvaluationField> table = informationTable.getActiveConditionAttributeFields();
        for(int i = 0; i < table.getNumberOfObjects(); i++) {
            StringBuilder sb = new StringBuilder();
            sb.append(i);
            sb.append(":");
            for(int j = 0; j < table.getNumberOfAttributes(); j++) {
                sb.append("\t");
                sb.append(table.getField(i, j));
            }
            logger.trace(sb.toString());
        }

        return project;
    }

    public Project setProject(UUID id, MultipartFile metadataFile, MultipartFile dataFile, MultipartFile rulesFile) throws IOException {
        logger.info("Id:\t" + id);
        if(metadataFile != null)    logger.info("Metadata:\t" + metadataFile.getOriginalFilename() + "\t" + metadataFile.getContentType());
        if(dataFile != null)        logger.info("Data:\t" + dataFile.getOriginalFilename() + "\t" + dataFile.getContentType());
        if(rulesFile != null)       logger.info("Rules:\t" + rulesFile.getOriginalFilename() + "\t" + rulesFile.getContentType());

        if(metadataFile == null) {
            return setEmptyProject(id);
        } else {
            if(dataFile != null) {
                return setProjectWithData(id, metadataFile, dataFile);
            } else {
                return setProjectWithMetadata(id, metadataFile);
            }
        }
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
