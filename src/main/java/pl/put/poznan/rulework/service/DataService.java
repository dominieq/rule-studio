package pl.put.poznan.rulework.service;

import javafx.util.Pair;
import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.json.AttributeParser;
import org.rulelearn.data.json.InformationTableWriter;
import org.rulelearn.data.json.ObjectParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.exception.ProjectNotFoundException;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.*;
import java.util.UUID;

@Service
public class DataService {

    private static final Logger logger = LoggerFactory.getLogger(DataService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private Project getProjectFromProjectsContainer(UUID id) {
        Project project = projectsContainer.getProjectHashMap().get(id);
        if(project == null) {
            ProjectNotFoundException ex = new ProjectNotFoundException(id);
            logger.error(ex.getMessage());
            throw ex;
        }

        return project;
    }

    public String getData(UUID id) throws IOException {
        logger.info("Id:\t" + id);

        Project project = getProjectFromProjectsContainer(id);

        StringWriter objectsWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(false);
        itw.writeObjects(project.getInformationTable(), objectsWriter);


        return objectsWriter.toString();
    }

    public Project putData(UUID id, String data) throws IOException {
        logger.info("Id:\t" + id);
        logger.info("Data:\t" + data);

        Project project = getProjectFromProjectsContainer(id);

        InputStream targetStream = new ByteArrayInputStream(data.getBytes());
        Reader reader = new InputStreamReader(targetStream);

        Attribute[] attributes = project.getInformationTable().getAttributes();
        ObjectParser objectParser = new ObjectParser.Builder(attributes).build();

        project.setInformationTable(objectParser.parseObjects(reader));
        logger.info(project.toString());

        return project;
    }

    private InputStreamResource produceJsonResource(InformationTable informationTable) throws IOException {
        StringWriter sw = new StringWriter();

        InformationTableWriter itw = new InformationTableWriter();
        itw.writeObjects(informationTable, sw);

        byte[] barray = sw.toString().getBytes();
        InputStream is = new ByteArrayInputStream(barray);

        return new InputStreamResource(is);
    }

    private InputStreamResource produceCsvResource(InformationTable informationTable, String separator) throws IOException {
        StringWriter sw = new StringWriter();

        org.rulelearn.data.csv.InformationTableWriter itw = new org.rulelearn.data.csv.InformationTableWriter();
        itw.writeObjects(informationTable, sw, separator);

        byte[] barray = sw.toString().getBytes();
        InputStream is = new ByteArrayInputStream(barray);

        return new InputStreamResource(is);
    }

    public Pair<String, Resource> getDownloadJson(UUID id) throws IOException {
        logger.info("Downloading data in json format");
        logger.info("Id:\t{}", id);

        Project project = getProjectFromProjectsContainer(id);

        InputStreamResource resource = produceJsonResource(project.getInformationTable());

        return new Pair<>(project.getName(), resource);
    }

    public Pair<String, Resource> getDownloadCsv(UUID id, String separator) throws IOException {
        logger.info("Downloading data in csv format");
        logger.info("Id:\t{}", id);
        logger.info("Separator:\t{}", separator);

        Project project = getProjectFromProjectsContainer(id);

        InputStreamResource resource = produceCsvResource(project.getInformationTable(), separator);

        return new Pair<>(project.getName(), resource);
    }

    public Pair<String, Resource> putDownloadJson(UUID id, String metadata, String data) throws IOException {
        logger.info("Downloading data in json format");
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = getProjectFromProjectsContainer(id);

        InputStream targetStream;
        Reader reader;

        // prepare attributes from metadata
        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        targetStream = new ByteArrayInputStream(metadata.getBytes());
        reader = new InputStreamReader(targetStream);
        attributes = attributeParser.parseAttributes(reader);

        // create InformationTable object
        targetStream = new ByteArrayInputStream(data.getBytes());
        reader = new InputStreamReader(targetStream);
        ObjectParser objectParser = new ObjectParser.Builder(attributes).build();
        InformationTable informationTable = objectParser.parseObjects(reader);

        // serialize data from InformationTable object
        InputStreamResource resource = produceJsonResource(informationTable);

        return new Pair<>(project.getName(), resource);
    }

    public Pair<String, Resource> putDownloadCsv(UUID id, String metadata, String data, String separator) throws IOException {
        logger.info("Downloading data in csv format");
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);
        logger.info("Separator:\t{}", separator);

        Project project = getProjectFromProjectsContainer(id);

        InputStream targetStream;
        Reader reader;

        // prepare attributes from metadata
        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        targetStream = new ByteArrayInputStream(metadata.getBytes());
        reader = new InputStreamReader(targetStream);
        attributes = attributeParser.parseAttributes(reader);

        // create InformationTable object
        targetStream = new ByteArrayInputStream(data.getBytes());
        reader = new InputStreamReader(targetStream);
        ObjectParser objectParser = new ObjectParser.Builder(attributes).build();
        InformationTable informationTable = objectParser.parseObjects(reader);

        // serialize data from InformationTable object
        InputStreamResource resource = produceCsvResource(informationTable, separator);

        return new Pair<>(project.getName(), resource);
    }
}
