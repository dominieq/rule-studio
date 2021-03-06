package pl.put.poznan.rulestudio.service;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.json.AttributeParser;
import org.rulelearn.data.json.InformationTableWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.exception.NoDataException;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.*;
import pl.put.poznan.rulestudio.model.response.AttributesResponse;
import pl.put.poznan.rulestudio.model.response.GlobalDescriptiveAttributesResponse;
import pl.put.poznan.rulestudio.model.response.InformationTableResponse;

import java.io.*;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class MetadataService {

    private static final Logger logger = LoggerFactory.getLogger(MetadataService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static void checkAttributes(Attribute[] attributes, String message) {
        if(attributes == null) {
            NoDataException ex = new NoDataException(message);
            logger.error(ex.getMessage());
            throw ex;
        }
    }

    private static Attribute[] attributesFromInputStreamMetadata(InputStream targetStream) throws IOException {
        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        Reader reader = new InputStreamReader(targetStream);
        try {
            attributes = attributeParser.parseAttributes(reader);
        } catch (RuntimeException e) {
            WrongParameterException ex = new WrongParameterException(new StringBuilder("Invalid format of json metadata, couldn't be successfully parsed.\t").append(e.getMessage()).toString());
            logger.error(ex.getMessage());
            throw ex;
        }

        checkAttributes(attributes, "Invalid format of json metadata, there are no attributes.");

        for(int i = 0; i < attributes.length; i++) {
            logger.info(i + ":\t" + attributes[i]);
        }

        return attributes;
    }

    public static Attribute[] attributesFromMultipartFileMetadata(MultipartFile metadata) throws IOException {
        InputStream targetStream = metadata.getInputStream();
        return attributesFromInputStreamMetadata(targetStream);
    }

    public static Attribute[] attributesFromStringMetadata(String metadata) throws IOException {
        InputStream targetStream = new ByteArrayInputStream(metadata.getBytes());
        return attributesFromInputStreamMetadata(targetStream);
    }

    public AttributesResponse getMetadata(UUID id) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = project.getInformationTable();
        DataService.checkInformationTable(informationTable, "There is no metadata in project. Couldn't get it.");

        final AttributesResponse result = new AttributesResponse(informationTable);
        logger.debug(result.toString());
        return result;
    }

    public InformationTableResponse putMetadata(UUID id, String metadata) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("metadataSize=").append(metadata.length()).append('B');
            if (logger.isDebugEnabled()) sb.append(", ").append("metadata=").append(metadata);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final Attribute[] attributes = attributesFromStringMetadata(metadata);

        final InformationTable informationTable = new InformationTable(attributes, new ArrayList<>());
        project.setInformationTable(informationTable);

        final InformationTableResponse informationTableResponse = new InformationTableResponse(informationTable);
        logger.debug(informationTableResponse.toString());
        return informationTableResponse;
    }

    private InputStreamResource produceJsonResource(InformationTable informationTable) throws IOException {
        StringWriter sw = new StringWriter();

        final InformationTableWriter itw = new InformationTableWriter();
        itw.writeAttributes(informationTable, sw);

        byte[] barray = sw.toString().getBytes();
        InputStream is = new ByteArrayInputStream(barray);

        return new InputStreamResource(is);
    }

    public NamedResource getDownload(UUID id) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = project.getInformationTable();
        DataService.checkInformationTable(informationTable, "There is no metadata in project. Couldn't download it.");

        final InputStreamResource resource = produceJsonResource(informationTable);

        return new NamedResource(project.getName(), resource);
    }

    public NamedResource putDownload(UUID id, String metadata) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("metadataSize=").append(metadata.length()).append('B');
            if (logger.isDebugEnabled()) sb.append(", ").append("metadata=").append(metadata);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        // prepare attributes from metadata
        final Attribute[] attributes = attributesFromStringMetadata(metadata);
        final InformationTable informationTable = new InformationTable(attributes, new ArrayList<>());

        // serialize data from InformationTable object
        final InputStreamResource resource = produceJsonResource(informationTable);

        return new NamedResource(project.getName(), resource);
    }

    public GlobalDescriptiveAttributesResponse getGlobalDescriptiveAttributes(UUID id) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final GlobalDescriptiveAttributesResponse globalDescriptiveAttributesResponse = new GlobalDescriptiveAttributesResponse(project);
        logger.debug(globalDescriptiveAttributesResponse.toString());
        return globalDescriptiveAttributesResponse;
    }

    public GlobalDescriptiveAttributesResponse postGlobalDescriptiveAttributes(UUID id, String objectVisibleName) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("objectVisibleName=\"").append(objectVisibleName).append('\"');
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        DescriptiveAttributes descriptiveAttributes = project.getDescriptiveAttributes();
        descriptiveAttributes.setCurrentAttribute(objectVisibleName);

        updateDescriptiveAttributesAcrossProject(project, objectVisibleName);

        final GlobalDescriptiveAttributesResponse globalDescriptiveAttributesResponse = new GlobalDescriptiveAttributesResponse(project);
        logger.debug(globalDescriptiveAttributesResponse.toString());
        return globalDescriptiveAttributesResponse;
    }

    public static void updateDescriptiveAttributesAcrossProject(Project project, String objectVisibleName) {
        DominanceCones dominanceCones = project.getDominanceCones();
        if(dominanceCones != null) {
            dominanceCones.getDescriptiveAttributes().trySetCurrentAttribute(objectVisibleName);
        }

        ProjectClassUnions projectClassUnions = project.getProjectClassUnions();
        if(projectClassUnions != null) {
            projectClassUnions.getDescriptiveAttributes().trySetCurrentAttribute(objectVisibleName);
        }

        ProjectRules projectRules = project.getProjectRules();
        if(projectRules != null) {
            projectRules.getDescriptiveAttributes().trySetCurrentAttribute(objectVisibleName);
        }

        ProjectClassification projectClassification = project.getProjectClassification();
        if(projectClassification != null) {
            projectClassification.getClassifiedDescriptiveAttributes().trySetCurrentAttribute(objectVisibleName);
            projectClassification.getLearningDescriptiveAttributes().trySetCurrentAttribute(objectVisibleName);
        }

        CrossValidation crossValidation = project.getCrossValidation();
        if(crossValidation != null) {
            crossValidation.getDescriptiveAttributes().trySetCurrentAttribute(objectVisibleName);
        }
    }
}
