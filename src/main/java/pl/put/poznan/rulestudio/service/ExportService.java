package pl.put.poznan.rulestudio.service;

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
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ExportService {

    private static final Logger logger = LoggerFactory.getLogger(ExportService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public NamedResource getExport(UUID id, ProjectFormat projectFormat) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("ProjectFormat:\t{}", projectFormat);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InputStreamResource resource;

        switch (projectFormat) {
            case XML:
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                XStream xStream = new XStream();
                xStream.toXML(project, baos);

                logger.info("Size before compressing:\t{} B", baos.size());
                logger.info("Compressing...");

                InputStream zipIs = new ByteArrayInputStream(baos.toByteArray());
                ByteArrayOutputStream zipBaos = new ByteArrayOutputStream();
                ZipOutputStream zipOs = new ZipOutputStream(zipBaos);
                ZipEntry zipEntry = new ZipEntry(project.getName() + ".xml");
                zipOs.putNextEntry(zipEntry);
                byte[] bytes = new byte[1024];
                int length;
                while((length = zipIs.read(bytes)) >= 0) {
                    zipOs.write(bytes, 0, length);
                }
                zipOs.closeEntry();
                zipOs.close();

                logger.info("Size after compressing:\t{} B", zipBaos.size());

                InputStream is = new ByteArrayInputStream(zipBaos.toByteArray());
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
