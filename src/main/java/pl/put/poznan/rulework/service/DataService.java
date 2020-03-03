package pl.put.poznan.rulework.service;

import javafx.util.Pair;
import org.rulelearn.data.Attribute;
import org.rulelearn.data.json.InformationTableWriter;
import org.rulelearn.data.json.ObjectParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
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
        return projectsContainer.getProjectHashMap().get(id);
    }

    public String getData(UUID id) throws IOException {
        logger.info("Id:\t" + id);

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }


        StringWriter objectsWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(false);
        itw.writeObjects(project.getInformationTable(), objectsWriter);


        return objectsWriter.toString();
    }

    public Project putData(UUID id, String data) throws IOException {
        logger.info("Id:\t" + id);
        logger.info("Data:\t" + data);

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }

        InputStream targetStream = new ByteArrayInputStream(data.getBytes());
        Reader reader = new InputStreamReader(targetStream);

        Attribute[] attributes = project.getInformationTable().getAttributes();
        ObjectParser objectParser = new ObjectParser.Builder(attributes).build();

        project.setInformationTable(objectParser.parseObjects(reader));
        logger.info(project.toString());

        return project;
    }

    public Pair<String, Resource> download(UUID id) throws IOException {
        logger.info("Id:\t" + id);

        Project project = getProjectFromProjectsContainer(id);
        if(project == null) {
            return null;
        }

        org.rulelearn.data.csv.InformationTableWriter itw = new org.rulelearn.data.csv.InformationTableWriter();
        StringWriter sw = new StringWriter();
        itw.writeObjects(project.getInformationTable(), sw, ",");

        byte[] barray = sw.toString().getBytes();
        InputStream is = new ByteArrayInputStream(barray);

        InputStreamResource resource = new InputStreamResource(is);

        return new Pair<>(project.getName(), resource);
    }
}
