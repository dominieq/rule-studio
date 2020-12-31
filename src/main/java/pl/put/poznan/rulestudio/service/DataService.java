package pl.put.poznan.rulestudio.service;

import org.rulelearn.core.AttributeNotFoundException;
import org.rulelearn.core.InvalidValueException;
import org.rulelearn.data.*;
import org.rulelearn.data.json.InformationTableWriter;
import org.rulelearn.data.json.ObjectParser;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.exception.CalculationException;
import pl.put.poznan.rulestudio.exception.NoDataException;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.NamedResource;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;
import pl.put.poznan.rulestudio.model.ValidityProjectContainer;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.model.response.ObjectsComparisonResponse.ObjectsComparisonResponseBuilder;

import java.io.*;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class DataService {

    private static final Logger logger = LoggerFactory.getLogger(DataService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static void checkInformationTable(InformationTable informationTable, String message) {
        if(informationTable == null) {
            NoDataException ex = new NoDataException(message);
            logger.error(ex.getMessage());
            throw ex;
        }
    }

    public static void checkNumberOfObjects(InformationTable informationTable, String message) {
        if(informationTable.getNumberOfObjects() == 0) {
            NoDataException ex = new NoDataException(message);
            logger.error(ex.getMessage());
            throw ex;
        }
    }

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
            String jsonMessage = new StringBuilder("Failed to parse as json file:\t").append(eJson.getMessage()).toString();
            logger.error(jsonMessage);

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
                String csvMessage = new StringBuilder("Failed to parse as csv file:\t").append(eCsv.getMessage()).toString();
                logger.error(csvMessage);

                WrongParameterException ex;
                if (dataFile.getOriginalFilename().endsWith(".json")) {
                    ex = new WrongParameterException(jsonMessage);
                } else if (dataFile.getOriginalFilename().endsWith(".csv")) {
                    ex = new WrongParameterException(csvMessage);
                } else {
                    ex = new WrongParameterException("Wrong file. Data should be a valid json or csv file.");
                }

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
            WrongParameterException ex = new WrongParameterException(new StringBuilder("Invalid format of json data, couldn't be successfully parsed.\t").append(e.getMessage()).toString());
            logger.error(ex.getMessage());
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

    public static InformationTableWithDecisionDistributions createInformationTableWithDecisionDistributions(InformationTable informationTable) {
        InformationTableWithDecisionDistributions informationTableWithDecisionDistributions;
        try {
            informationTableWithDecisionDistributions = new InformationTableWithDecisionDistributions(informationTable);
        } catch (AttributeNotFoundException e) {
            CalculationException ex = new CalculationException("Cannot perform calculation if there are no active condition evaluation attributes.");
            logger.error(ex.getMessage());
            throw ex;
        } catch (InvalidValueException e) {
            CalculationException ex = new CalculationException("Cannot perform calculation if there is no active decision attribute.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return informationTableWithDecisionDistributions;
    }

    public InformationTableResponse getData(UUID id) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();
        if(informationTable == null) informationTable = new InformationTable(new Attribute[0], new ArrayList<>());
        checkInformationTable(informationTable, "There are no objects in project. Couldn't get them.");

        final InformationTableResponse informationTableResponse = new InformationTableResponse(informationTable);
        logger.debug(informationTableResponse.toString());
        return informationTableResponse;
    }

    public InformationTableResponse putData(UUID id, String data) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("dataSize=").append(data.length()).append('B');
            if (logger.isDebugEnabled()) sb.append(", ").append("data=").append(data);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = project.getInformationTable();
        checkInformationTable(informationTable, "There is no metadata in project. Couldn't pass new data.");

        final Attribute[] attributes = informationTable.getAttributes();
        final InformationTable newInformationTable = informationTableFromStringData(data, attributes);
        project.setInformationTable(newInformationTable);

        final InformationTableResponse informationTableResponse = new InformationTableResponse(newInformationTable);
        logger.debug(informationTableResponse.toString());
        return informationTableResponse;
    }

    public ValidityProjectContainer postData(UUID id, String metadata, String data) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("metadataSize=").append(metadata.length()).append("B, ");
            if (logger.isDebugEnabled()) sb.append("metadata=").append(metadata).append(", ");
            sb.append("dataSize=").append(data.length()).append('B');
            if (logger.isDebugEnabled()) sb.append(", ").append("data=").append(data);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        final ValidityProjectContainer validityProjectContainer = new ValidityProjectContainer(project);
        logger.debug(validityProjectContainer.toString());
        return validityProjectContainer;
    }

    private InputStreamResource produceJsonResource(InformationTable informationTable) throws IOException {
        StringWriter sw = new StringWriter();

        InformationTableWriter itw = new InformationTableWriter();
        itw.writeObjects(informationTable, sw);

        byte[] barray = sw.toString().getBytes();
        final InputStream is = new ByteArrayInputStream(barray);

        return new InputStreamResource(is);
    }

    private InputStreamResource produceCsvResource(InformationTable informationTable, String separator, Boolean header) throws IOException {
        StringWriter sw = new StringWriter();

        org.rulelearn.data.csv.InformationTableWriter itw = new org.rulelearn.data.csv.InformationTableWriter();
        itw.writeObjects(informationTable, sw, separator, header);

        byte[] barray = sw.toString().getBytes();
        final InputStream is = new ByteArrayInputStream(barray);

        return new InputStreamResource(is);
    }

    public NamedResource getDownloadJson(UUID id) throws IOException {
        logger.info("Downloading data in json format");
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = project.getInformationTable();
        checkInformationTable(informationTable, "There is no data in project. Couldn't download objects.");

        final InputStreamResource resource = produceJsonResource(informationTable);

        return new NamedResource(project.getName(), resource);
    }

    public NamedResource getDownloadCsv(UUID id, String separator, Boolean header) throws IOException {
        logger.info("Downloading data in csv format");
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("separator=\"").append(separator).append("\", ");
            sb.append("header=").append(header);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = project.getInformationTable();
        checkInformationTable(informationTable, "There is no data in project. Couldn't download objects.");

        final InputStreamResource resource = produceCsvResource(informationTable, separator, header);

        return new NamedResource(project.getName(), resource);
    }

    public NamedResource putDownloadJson(UUID id, String metadata, String data) throws IOException {
        logger.info("Downloading data in json format");
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("metadataSize=").append(metadata.length()).append("B, ");
            if (logger.isDebugEnabled()) sb.append("metadata=").append(metadata).append(", ");
            sb.append("dataSize=").append(data.length()).append('B');
            if (logger.isDebugEnabled()) sb.append(", ").append("data=").append(data);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        // create InformationTable from json strings
        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);

        // serialize data from InformationTable
        final InputStreamResource resource = produceJsonResource(informationTable);

        return new NamedResource(project.getName(), resource);
    }

    public NamedResource putDownloadCsv(UUID id, String metadata, String data, String separator, Boolean header) throws IOException {
        logger.info("Downloading data in csv format");
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("metadataSize=").append(metadata.length()).append("B, ");
            if (logger.isDebugEnabled()) sb.append("metadata=").append(metadata).append(", ");
            sb.append("dataSize=").append(data.length()).append("B, ");
            if (logger.isDebugEnabled()) sb.append("data=").append(data).append(", ");
            sb.append("separator=\"").append(separator).append("\", ");
            sb.append("header=").append(header);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        // create InformationTable from json strings
        final InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);

        // serialize data from InformationTable object
        final InputStreamResource resource = produceCsvResource(informationTable, separator, header);

        return new NamedResource(project.getName(), resource);
    }

    public ObjectAbstractResponse getObject(UUID id, Integer objectIndex, Boolean isAttributes) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("objectIndex=").append(objectIndex).append(", ");
            sb.append("isAttributes=").append(isAttributes);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = project.getInformationTable();
        checkInformationTable(informationTable, "There are no objects in project. Couldn't get any of them.");

        ObjectAbstractResponse objectAbstractResponse;
        if(isAttributes) {
            objectAbstractResponse = new ObjectWithAttributesResponse(informationTable, objectIndex);
        } else {
            objectAbstractResponse = new ObjectResponse(informationTable, objectIndex);
        }
        logger.debug(objectAbstractResponse.toString());
        return objectAbstractResponse;
    }

    public ObjectsComparisonResponse getObjectsComparison(UUID id, Integer firstObjectIndex, Integer secondObjectIndex) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("firstObjectIndex=").append(firstObjectIndex).append(", ");
            sb.append("secondObjectIndex=").append(secondObjectIndex);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = project.getInformationTable();
        checkInformationTable(informationTable, "There are no objects in project. Couldn't get any of them.");

        final ObjectsComparisonResponse objectsComparisonResponse = ObjectsComparisonResponseBuilder.newInstance().build(informationTable, firstObjectIndex, secondObjectIndex);
        logger.debug(objectsComparisonResponse.toString());
        return objectsComparisonResponse;
    }
}
