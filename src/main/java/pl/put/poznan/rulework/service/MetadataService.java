package pl.put.poznan.rulework.service;

import javafx.util.Pair;
import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.json.AttributeParser;
import org.rulelearn.data.json.InformationTableWriter;
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
import java.util.ArrayList;
import java.util.UUID;

@Service
public class MetadataService {

    private static final Logger logger = LoggerFactory.getLogger(MetadataService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public Attribute[] getMetadata(UUID id) {
        logger.info("Id:\t" + id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        return project.getInformationTable().getAttributes();
    }

    public Project putMetadata(UUID id, String metadata) throws IOException {
        logger.info("Id:\t" + id);
        logger.info("Metadata:\t" + metadata);


        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        InputStream targetStream = new ByteArrayInputStream(metadata.getBytes());
        Reader reader = new InputStreamReader(targetStream);
        attributes = attributeParser.parseAttributes(reader);
        for(int i = 0; i < attributes.length; i++) {
            logger.info(i + ":\t" + attributes[i]);
        }

        InformationTable informationTable = new InformationTable(attributes, new ArrayList<>());

        project.setInformationTable(informationTable);
        logger.info(project.toString());

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

    public Pair<String, Resource> getDownload(UUID id) throws IOException {
        logger.info("Id:\t" + id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InputStreamResource resource = produceJsonResource(project.getInformationTable());

        return new Pair<>(project.getName(), resource);
    }

    public Pair<String, Resource> putDownload(UUID id, String metadata) throws IOException {
        logger.info("Downloading metadata in json format");
        logger.info("Id:\t{}", id);
        logger.info("Metadata:\t{}", metadata);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);
        if(project == null) {
            return null;
        }

        // prepare attributes from metadata
        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        InputStream targetStream = new ByteArrayInputStream(metadata.getBytes());
        Reader reader = new InputStreamReader(targetStream);
        attributes = attributeParser.parseAttributes(reader);
        InformationTable informationTable = new InformationTable(attributes, new ArrayList<>());

        // serialize data from InformationTable object
        InputStreamResource resource = produceJsonResource(informationTable);

        return new Pair<>(project.getName(), resource);
    }
}
