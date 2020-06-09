package pl.put.poznan.rulestudio.service;

import com.thoughtworks.xstream.XStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.model.NamedResource;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;

import java.io.*;
import java.util.UUID;

@Service
public class ExportService {

    private static final Logger logger = LoggerFactory.getLogger(ExportService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public NamedResource getExport(UUID id) throws IOException {
        logger.info("Id:\t{}", id);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        XStream xStream = new XStream();
        xStream.toXML(project, baos);

        InputStream is = new ByteArrayInputStream(baos.toByteArray());
        InputStreamResource resource = new InputStreamResource(is);

        return new NamedResource(project.getName(), resource);
    }
}
