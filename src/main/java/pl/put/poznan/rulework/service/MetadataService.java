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

    private Project getProjectFromProjectsContainer(UUID id) {
        Project project = projectsContainer.getProjectHashMap().get(id);
        if(project == null) {
            ProjectNotFoundException ex = new ProjectNotFoundException(id);
            logger.error(ex.getMessage());
            throw ex;
        }

        return project;
    }

    public Attribute[] getMetadata(UUID id) {
        logger.info("Id:\t" + id);

        Project project = getProjectFromProjectsContainer(id);

        return project.getInformationTable().getAttributes();
    }

    public Project putMetadata(UUID id, String metadata) throws IOException {
        logger.info("Id:\t" + id);
        logger.info("Metadata:\t" + metadata);


        Project project = getProjectFromProjectsContainer(id);

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

    public Pair<String, Resource> download(UUID id) throws IOException {
        logger.info("Id:\t" + id);

        Project project = getProjectFromProjectsContainer(id);

        InformationTableWriter itw = new InformationTableWriter();
        StringWriter sw = new StringWriter();
        itw.writeAttributes(project.getInformationTable(), sw);

        byte[] barray = sw.toString().getBytes();
        InputStream is = new ByteArrayInputStream(barray);

        InputStreamResource resource = new InputStreamResource(is);

        return new Pair<>(project.getName(), resource);
    }
}
