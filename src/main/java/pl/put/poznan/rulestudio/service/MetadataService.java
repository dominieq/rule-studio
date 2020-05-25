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
import pl.put.poznan.rulestudio.model.NamedResource;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;

import java.io.*;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class MetadataService {

    private static final Logger logger = LoggerFactory.getLogger(MetadataService.class);

    @Autowired
    ProjectsContainer projectsContainer;

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

        if(attributes == null) {
            WrongParameterException ex = new WrongParameterException("Invalid format of json metadata, there are no attributes.");
            logger.error(ex.getMessage());
            throw ex;
        }

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

    public Attribute[] getMetadata(UUID id) {
        logger.info("Id:\t" + id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();
        if (informationTable == null) {
            NoDataException ex = new NoDataException("There is no metadata in project. Couldn't get it.");
            logger.error(ex.getMessage());
            throw ex;
        }

        Attribute[] result = informationTable.getAttributes();
        logger.debug(result.toString());
        return result;
    }

    public Project putMetadata(UUID id, String metadata) throws IOException {
        logger.info("Id:\t" + id);
        logger.info("Metadata:\t" + metadata);


        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        Attribute[] attributes = attributesFromStringMetadata(metadata);

        InformationTable informationTable = new InformationTable(attributes, new ArrayList<>());

        project.setInformationTable(informationTable);
        logger.debug(project.toString());

        return project;
    }

    private InputStreamResource produceJsonResource(InformationTable informationTable) throws IOException {
        StringWriter sw = new StringWriter();

        InformationTableWriter itw = new InformationTableWriter();
        itw.writeAttributes(informationTable, sw);

        byte[] barray = sw.toString().getBytes();
        InputStream is = new ByteArrayInputStream(barray);

        return new InputStreamResource(is);
    }

    public NamedResource getDownload(UUID id) throws IOException {
        logger.info("Id:\t" + id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();
        if (informationTable == null) {
            NoDataException ex = new NoDataException("There is no metadata in project. Couldn't download it.");
            logger.error(ex.getMessage());
            throw ex;
        }

        InputStreamResource resource = produceJsonResource(informationTable);

        return new NamedResource(project.getName(), resource);
    }

    public NamedResource putDownload(UUID id, String metadata) throws IOException {
        logger.info("Downloading metadata in json format");
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        // prepare attributes from metadata
        Attribute[] attributes = attributesFromStringMetadata(metadata);
        InformationTable informationTable = new InformationTable(attributes, new ArrayList<>());

        // serialize data from InformationTable object
        InputStreamResource resource = produceJsonResource(informationTable);

        return new NamedResource(project.getName(), resource);
    }
}
