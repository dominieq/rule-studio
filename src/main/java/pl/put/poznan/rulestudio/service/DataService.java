package pl.put.poznan.rulestudio.service;

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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.exception.NoDataException;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.NamedResource;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;
import pl.put.poznan.rulestudio.model.ValidityContainer;

import java.io.*;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class DataService {

    private static final Logger logger = LoggerFactory.getLogger(DataService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static InformationTable informationTableFromMultipartFileData(MultipartFile dataFile, Attribute[] attributes, Character separator, Boolean header) throws IOException {
        logger.info("Start of processing data file...");
        Reader reader;
        InformationTable informationTable = new InformationTable(new Attribute[0], new ArrayList<>());

        try {
            logger.info("Trying parse as json file...");
            org.rulelearn.data.json.ObjectParser jsonObjectParser = new org.rulelearn.data.json.ObjectParser.Builder(attributes).build();
            reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = jsonObjectParser.parseObjects(reader);
            logger.info("Successfully parsed as json file.");
        } catch (RuntimeException eJson) {
            logger.error("Failed to parse as json file:\t{}", eJson.getMessage());

            try {
                logger.info("Trying parse as csv file...");
                org.rulelearn.data.csv.ObjectParser csvObjectParser = new org.rulelearn.data.csv.ObjectParser.Builder(attributes).
                        separator(separator).
                        header(header).
                        build();
                reader = new InputStreamReader(dataFile.getInputStream());
                informationTable = csvObjectParser.parseObjects(reader);
                logger.info("Successfully parsed as csv file.");
            } catch (RuntimeException eCsv) {
                logger.error("Failed to parse as csv file:\t{}", eCsv.getMessage());

                WrongParameterException ex = new WrongParameterException("Wrong file. Data should be a valid json or csv file.");
                throw ex;
            }
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

        logger.info("End of processing data file.");
        return informationTable;
    }

    public static InformationTable informationTableFromStringData(String data, Attribute[] attributes) throws IOException {
        logger.info("Start of processing data text...");
        InputStream targetStream = new ByteArrayInputStream(data.getBytes());
        Reader reader = new InputStreamReader(targetStream);
        ObjectParser objectParser = new ObjectParser.Builder(attributes).build();
        InformationTable informationTable;
        try {
            informationTable = objectParser.parseObjects(reader);
        } catch (RuntimeException e) {
            WrongParameterException ex = new WrongParameterException("Invalid format of json data, couldn't be successfully parsed.");
            logger.error("{}:\t{}", ex.getMessage(), e.getMessage());
            throw ex;
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

        logger.info("End of processing data text.");
        return informationTable;
    }

    public String getData(UUID id) throws IOException {
        logger.info("Id:\t" + id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        StringWriter objectsWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(false);

        InformationTable informationTable = project.getInformationTable();
        if(informationTable == null) {
            NoDataException ex = new NoDataException("There are no objects in project. Couldn't get them.");
            logger.error(ex.getMessage());
            throw ex;
        }

        itw.writeObjects(informationTable, objectsWriter);

        return objectsWriter.toString();
    }

    public Project putData(UUID id, String data) throws IOException {
        logger.info("Id:\t" + id);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t" + data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();
        if(informationTable == null) {
            NoDataException ex = new NoDataException("There is no metadata in project. Couldn't pass new data.");
            logger.error(ex.getMessage());
            throw ex;
        }

        Attribute[] attributes = informationTable.getAttributes();
        InformationTable newInformationTable = informationTableFromStringData(data, attributes);

        project.setInformationTable(newInformationTable);
        logger.debug(project.toString());

        return project;
    }

    public ValidityContainer postData(UUID id, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        ValidityContainer validityContainer = new ValidityContainer(project);

        return validityContainer;
    }

    private InputStreamResource produceJsonResource(InformationTable informationTable) throws IOException {
        StringWriter sw = new StringWriter();

        InformationTableWriter itw = new InformationTableWriter();
        itw.writeObjects(informationTable, sw);

        byte[] barray = sw.toString().getBytes();
        InputStream is = new ByteArrayInputStream(barray);

        return new InputStreamResource(is);
    }

    private InputStreamResource produceCsvResource(InformationTable informationTable, String separator, Boolean header) throws IOException {
        StringWriter sw = new StringWriter();

        org.rulelearn.data.csv.InformationTableWriter itw = new org.rulelearn.data.csv.InformationTableWriter();
        itw.writeObjects(informationTable, sw, separator, header);

        byte[] barray = sw.toString().getBytes();
        InputStream is = new ByteArrayInputStream(barray);

        return new InputStreamResource(is);
    }

    public NamedResource getDownloadJson(UUID id) throws IOException {
        logger.info("Downloading data in json format");
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();
        if(informationTable == null) {
            NoDataException ex = new NoDataException("There is no data in project. Couldn't download objects.");
            logger.error(ex.getMessage());
            throw ex;
        }

        InputStreamResource resource = produceJsonResource(informationTable);

        return new NamedResource(project.getName(), resource);
    }

    public NamedResource getDownloadCsv(UUID id, String separator, Boolean header) throws IOException {
        logger.info("Downloading data in csv format");
        logger.info("Id:\t{}", id);
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();
        if(informationTable == null) {
            NoDataException ex = new NoDataException("There is no data in project. Couldn't download objects.");
            logger.error(ex.getMessage());
            throw ex;
        }

        InputStreamResource resource = produceCsvResource(informationTable, separator, header);

        return new NamedResource(project.getName(), resource);
    }

    public NamedResource putDownloadJson(UUID id, String metadata, String data) throws IOException {
        logger.info("Downloading data in json format");
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        // create InformationTable from json strings
        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);

        // serialize data from InformationTable
        InputStreamResource resource = produceJsonResource(informationTable);

        return new NamedResource(project.getName(), resource);
    }

    public NamedResource putDownloadCsv(UUID id, String metadata, String data, String separator, Boolean header) throws IOException {
        logger.info("Downloading data in csv format");
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        // create InformationTable from json strings
        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);

        // serialize data from InformationTable object
        InputStreamResource resource = produceCsvResource(informationTable, separator, header);

        return new NamedResource(project.getName(), resource);
    }
}
