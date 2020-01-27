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
import java.util.UUID;

@Service
public class ImportService {

    private static final Logger logger = LoggerFactory.getLogger(ImportService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private Project getProjectFromProjectsContainer(UUID id) {
        return projectsContainer.getProjectHashMap().get(id);
    }

    public String getData(UUID id) throws IOException {

        logger.info("Id:\t" + id);

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }

        StringWriter objectsWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(true);
        itw.writeObjects(project.getInformationTable(), objectsWriter);
        return objectsWriter.toString();
    }

    public String getMetadata(UUID id) throws IOException {

        logger.info("Id:\t" + id);

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }

        StringWriter attributesWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(true);
        itw.writeAttributes(project.getInformationTable(), attributesWriter);
        return attributesWriter.toString();
    }

    public String getDataAndMetadata(UUID id) throws IOException {

        logger.info("Id:\t" + id);

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }

        StringWriter attributesWriter = new StringWriter();
        StringWriter objectsWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(true);
        itw.writeAttributes(project.getInformationTable(), attributesWriter);
        itw.writeObjects(project.getInformationTable(), objectsWriter);

        JsonParser parser = new JsonParser();
        JsonArray attributesJson = (JsonArray) parser.parse(attributesWriter.toString());
        JsonArray objectsJson = (JsonArray) parser.parse(objectsWriter.toString());
        JsonObject jsonObject = new JsonObject();
        jsonObject.add("attributes", attributesJson);
        jsonObject.add("objects", objectsJson);

        return jsonObject.toString();
    }

    public Project createProjectWithData(String name, MultipartFile metadataFile, MultipartFile dataFile) throws IOException {

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

    public Project createProjectWithMetadata(String name, MultipartFile metadataFile) throws IOException {

        logger.info("Name:\t" + name);
        logger.info("Metadata:\t" + metadataFile.getOriginalFilename() + "\t" + metadataFile.getContentType());

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

    public Project updateDataAndMetadata(UUID id, MultipartFile metadataFile, MultipartFile dataFile) throws IOException {

        logger.info("Id:\t" + id);
        logger.info("Metadata:\t" + metadataFile.getOriginalFilename() + "\t" + metadataFile.getContentType());
        logger.info("Data:\t" + dataFile.getOriginalFilename() + "\t" + dataFile.getContentType());

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

        return project;
    }

    public Project updateData(UUID id, MultipartFile dataFile) throws IOException {

        logger.info("Id:\t" + id);
        logger.info("Data:\t" + dataFile.getOriginalFilename() + "\t" + dataFile.getContentType());

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }

        Attribute[] attributes = project.getInformationTable().getAttributes();
        for(int i = 0; i < attributes.length; i++) {
            logger.info(i + ":\t" + attributes[i]);
        }

        InformationTable informationTable = null;

        if (dataFile.getContentType().equals("application/json")) {
            logger.info("Data type is json");
            org.rulelearn.data.json.ObjectParser objectParser = new org.rulelearn.data.json.ObjectParser.Builder(attributes).build();
            Reader reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = objectParser.parseObjects(reader);

        } else if (dataFile.getContentType().equals("application/vnd.ms-excel")) {
            logger.info("Data type is csv");
            ObjectParser objectParser = new ObjectParser.Builder(attributes).build();
            Reader reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = objectParser.parseObjects(reader);
        } else {
            logger.error("Unrecognized format of data file: " + dataFile.getContentType());
        }

        project.setInformationTable(informationTable);

        return project;
    }

    public Project updateMetadata(UUID id, MultipartFile metadataFile) throws IOException {

        logger.info("Id:\t" + id);
        logger.info("Metadata:\t" + metadataFile.getOriginalFilename() + "\t" + metadataFile.getContentType());

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

        return project;
    }
}
