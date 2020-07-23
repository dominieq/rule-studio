package pl.put.poznan.rulestudio.service;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.thoughtworks.xstream.XStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.enums.ProjectFormat;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
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

    public NamedResource getExport(UUID id, ProjectFormat projectFormat) {
        logger.info("Id:\t{}", id);
        logger.info("ProjectFormat:\t{}", projectFormat);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InputStreamResource resource;

        switch (projectFormat) {
            case XML:
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                XStream xStream = new XStream();
                xStream.toXML(project, baos);

                InputStream is = new ByteArrayInputStream(baos.toByteArray());
                resource = new InputStreamResource(is);
                break;
            case BIN:
                WrongParameterException ex = new WrongParameterException(String.format("Given format of project \"%s\" is not supported yet.", projectFormat));
                logger.error(ex.getMessage());
                throw ex;
            default:
                ex = new WrongParameterException(String.format("Given format of project \"%s\" is unrecognized.", projectFormat));
                logger.error(ex.getMessage());
                throw ex;
        }

        return new NamedResource(project.getName(), resource);
    }
}
