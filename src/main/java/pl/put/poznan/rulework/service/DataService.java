package pl.put.poznan.rulework.service;

import javafx.util.Pair;
import org.rulelearn.data.Attribute;
import org.rulelearn.data.EvaluationAttribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.Table;
import org.rulelearn.data.json.InformationTableWriter;
import org.rulelearn.data.json.ObjectParser;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.*;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class DataService {

    private static final Logger logger = LoggerFactory.getLogger(DataService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static InformationTable informationTableFromMultipartFileData(MultipartFile dataFile, Attribute[] attributes, Character separator, Boolean header) throws IOException {
        Reader reader;
        InformationTable informationTable =  new InformationTable(new Attribute[0], new ArrayList<>());

        if (dataFile.getContentType().equals("application/json")) {
            logger.info("Data type is json");
            org.rulelearn.data.json.ObjectParser objectParser = new org.rulelearn.data.json.ObjectParser.Builder(attributes).build();
            reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = objectParser.parseObjects(reader);

        } else if (dataFile.getContentType().equals("application/vnd.ms-excel")) {
            logger.info("Data type is csv");
            org.rulelearn.data.csv.ObjectParser objectParser = new org.rulelearn.data.csv.ObjectParser.Builder(attributes).
                    separator(separator).
                    header(header).
                    build();
            reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = objectParser.parseObjects(reader);
        } else {
            logger.error("Unrecognized format of data file: " + dataFile.getContentType());
        }

        if(logger.isTraceEnabled()) {
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
        }

        return informationTable;
    }

    public static InformationTable informationTableFromStringData(String data, Attribute[] attributes) throws IOException {
        InputStream targetStream = new ByteArrayInputStream(data.getBytes());
        Reader reader = new InputStreamReader(targetStream);
        ObjectParser objectParser = new ObjectParser.Builder(attributes).build();
        InformationTable informationTable = objectParser.parseObjects(reader);

        if(logger.isTraceEnabled()) {
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
        }

        return informationTable;
    }

    public String getData(UUID id) throws IOException {
        logger.info("Id:\t" + id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        StringWriter objectsWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(false);
        itw.writeObjects(project.getInformationTable(), objectsWriter);


        return objectsWriter.toString();
    }

    public Project putData(UUID id, String data) throws IOException {
        logger.info("Id:\t" + id);
        logger.info("Data:\t" + data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        Attribute[] attributes = project.getInformationTable().getAttributes();
        InformationTable informationTable = informationTableFromStringData(data, attributes);

        project.setInformationTable(informationTable);
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

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InputStreamResource resource = produceJsonResource(project.getInformationTable());

        return new Pair<>(project.getName(), resource);
    }

    public Pair<String, Resource> getDownloadCsv(UUID id, String separator) throws IOException {
        logger.info("Downloading data in csv format");
        logger.info("Id:\t{}", id);
        logger.info("Separator:\t{}", separator);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InputStreamResource resource = produceCsvResource(project.getInformationTable(), separator);

        return new Pair<>(project.getName(), resource);
    }

    public Pair<String, Resource> putDownloadJson(UUID id, String metadata, String data) throws IOException {
        logger.info("Downloading data in json format");
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        // create InformationTable from json strings
        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);

        // serialize data from InformationTable
        InputStreamResource resource = produceJsonResource(informationTable);

        return new Pair<>(project.getName(), resource);
    }

    public Pair<String, Resource> putDownloadCsv(UUID id, String metadata, String data, String separator) throws IOException {
        logger.info("Downloading data in csv format");
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);
        logger.info("Separator:\t{}", separator);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        // create InformationTable from json strings
        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);

        // serialize data from InformationTable object
        InputStreamResource resource = produceCsvResource(informationTable, separator);

        return new Pair<>(project.getName(), resource);
    }
}
