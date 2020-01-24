package pl.put.poznan.rulework.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.rulelearn.data.*;
import org.rulelearn.data.csv.ObjectParser;
import org.rulelearn.data.json.AttributeParser;
import org.rulelearn.data.json.InformationTableWriter;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImportService {

    private static final Logger logger = LoggerFactory.getLogger(ImportService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public Project createProject(String name, MultipartFile metadataFile, MultipartFile dataFile) throws IOException {

        logger.info("Name:\t" + name);
        logger.info("Metadata:\t" + metadataFile.getOriginalFilename() + "\t" + metadataFile.getContentType());
        logger.info("Data:\t" + dataFile.getOriginalFilename() + "\t" + dataFile.getContentType());

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
        projectsContainer.getProjectArray().add(project);
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

    public List<Project> getData(UUID id) {
        StringBuilder sb = new StringBuilder();
        projectsContainer.getProjectArray().forEach(project -> {
            sb.append(project.toString());
        });
        logger.info(sb.toString());

        return projectsContainer.getProjectArray();
    }

    public Project getProject() {

        return projectsContainer.getProjectArray().get(0);
    }
}
