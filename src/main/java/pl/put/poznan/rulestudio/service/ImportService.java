package pl.put.poznan.rulestudio.service;

import com.thoughtworks.xstream.XStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;

import java.io.IOException;

@Service
public class ImportService {

    private static final Logger logger = LoggerFactory.getLogger(ImportService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public Project getImport(MultipartFile importFile) throws IOException, ClassNotFoundException {
        Project project = null;

        XStream xStream = new XStream();
        project = (Project)xStream.fromXML(importFile.getInputStream());

        projectsContainer.addProject(project);
        return project;
    }
}
