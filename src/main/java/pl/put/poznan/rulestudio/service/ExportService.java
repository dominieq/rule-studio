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
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ExportService {

    private static final Logger logger = LoggerFactory.getLogger(ExportService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public NamedResource getExport(UUID id) throws IOException {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        final XStream xStream = new XStream();
        xStream.toXML(project, baos);

        logger.info("Size before compressing:\t{} B", baos.size());
        logger.info("Compressing...");

        final InputStream zipIs = new ByteArrayInputStream(baos.toByteArray());
        ByteArrayOutputStream zipBaos = new ByteArrayOutputStream();
        ZipOutputStream zipOs = new ZipOutputStream(zipBaos);
        final ZipEntry zipEntry = new ZipEntry(project.getName() + ".xml");
        zipOs.putNextEntry(zipEntry);
        byte[] bytes = new byte[1024];
        int length;
        while((length = zipIs.read(bytes)) >= 0) {
            zipOs.write(bytes, 0, length);
        }
        zipOs.closeEntry();
        zipOs.close();

        logger.info("Size after compressing:\t{} B", zipBaos.size());

        final InputStream is = new ByteArrayInputStream(zipBaos.toByteArray());
        final InputStreamResource resource = new InputStreamResource(is);


        return new NamedResource(project.getName(), resource);
    }
}
