package pl.put.poznan.rulework.service;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.EvaluationAttribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.Table;
import org.rulelearn.data.csv.ObjectParser;
import org.rulelearn.data.json.AttributeParser;
import org.rulelearn.rules.RuleCharacteristics;
import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.rulelearn.rules.ruleml.RuleParser;
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
import java.util.Map;
import java.util.UUID;

@Service
public class ProjectsService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectsService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private Project getProjectFromProjectsContainer(UUID id) {
        return projectsContainer.getProjectHashMap().get(id);
    }

    private void addProjectToProjectsContainer(Project project) {
        projectsContainer.getProjectHashMap().put(project.getId(), project);
    }

    public ArrayList<Project> getProjects() {
        return new ArrayList<Project>(projectsContainer.getProjectHashMap().values());
    }

    private Project createEmptyProject(String name) {
        Project project = new Project(name);
        addProjectToProjectsContainer(project);
        return project;
    }

    public Project createProjectWithMetadata(String name, MultipartFile metadataFile) throws IOException {

        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        Reader reader = new InputStreamReader(metadataFile.getInputStream());
        attributes = attributeParser.parseAttributes(reader);
        for(int i = 0; i < attributes.length; i++) {
            logger.info(i + ":\t" + attributes[i]);
        }

        InformationTable informationTable = new InformationTable(attributes, new ArrayList<>());

        Project project = new Project(name, informationTable);
        projectsContainer.getProjectHashMap().put(project.getId(), project);
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
            logger.info(sb.toString());
        }

        return project;
    }

    public Project createProjectWithData(String name, MultipartFile metadataFile, MultipartFile dataFile) throws IOException {

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

        Project project = new Project(name, informationTable);
        projectsContainer.getProjectHashMap().put(project.getId(), project);
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
            logger.info(sb.toString());
        }

        return project;
    }

    public Project createProjectWithRules(String name, MultipartFile metadataFile, MultipartFile rulesFile) throws IOException {

        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        Reader reader = new InputStreamReader(metadataFile.getInputStream());
        attributes = attributeParser.parseAttributes(reader);
        for(int i = 0; i < attributes.length; i++) {
            logger.info(i + ":\t" + attributes[i]);
        }

        Map<Integer, RuleSetWithCharacteristics> parsedRules = null;
        RuleParser ruleParser = new RuleParser(attributes);
        parsedRules = ruleParser.parseRulesWithCharacteristics(rulesFile.getInputStream());

        Map.Entry<Integer, RuleSetWithCharacteristics> entry = parsedRules.entrySet().iterator().next();
        RuleSetWithCharacteristics ruleSetWithCharacteristics = entry.getValue();

        for(RuleSetWithCharacteristics rswc : parsedRules.values()) {
            logger.info("ruleSet.size=" + rswc.size());
            for(int i = 0; i < rswc.size(); i++) {
                RuleCharacteristics ruleCharacteristics = rswc.getRuleCharacteristics(i);
                logger.info(i + ":\t" + ruleCharacteristics.toString());
            }
        }

        InformationTable informationTable = new InformationTable(attributes, new ArrayList<>());

        Project project = new Project(name, informationTable);
        project.setRuleSetWithCharacteristics(ruleSetWithCharacteristics);
        projectsContainer.getProjectHashMap().put(project.getId(), project);
        logger.info(project.toString());

        //logger.info("Support:\t" + ruleSetWithCharacteristics.getRuleCharacteristics(0).getSupport());

        return project;
    }

    public Project createProject(String name, MultipartFile metadataFile, MultipartFile dataFile, MultipartFile rulesFile) throws IOException {
        logger.info("Name:\t" + name);
        if(metadataFile != null)    logger.info("Metadata:\t" + metadataFile.getOriginalFilename() + "\t" + metadataFile.getContentType());
        if(dataFile != null)        logger.info("Data:\t" + dataFile.getOriginalFilename() + "\t" + dataFile.getContentType());
        if(rulesFile != null)       logger.info("Rules:\t" + rulesFile.getOriginalFilename() + "\t" + rulesFile.getContentType());

        if(metadataFile == null) {
            return createEmptyProject(name);
        } else {
            if(dataFile != null) {
                return createProjectWithData(name, metadataFile, dataFile);
            } else if(rulesFile != null) {
                return createProjectWithRules(name, metadataFile, rulesFile);
            } else {
                return createProjectWithMetadata(name, metadataFile);
            }
        }
    }
}
