package pl.put.poznan.rulestudio.service;

import com.thoughtworks.xstream.XStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;
import java.util.zip.ZipInputStream;

@Service
public class ImportService {

    private static final Logger logger = LoggerFactory.getLogger(ImportService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public Project postImport(MultipartFile importFile) throws IOException {
        logger.info("ImportFile:\t{}\t{}", importFile.getOriginalFilename(), importFile.getContentType());

        Project project = null;

        try {
            logger.info("Trying import project from zip file...");

            logger.info("Size before decompressing:\t{} B", importFile.getSize());
            logger.info("Decompressing...");

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            final ZipInputStream zipIs = new ZipInputStream(importFile.getInputStream());
            zipIs.getNextEntry();
            byte[] bytes = new byte[1024];
            int length;
            while((length = zipIs.read(bytes)) >= 0) {
                baos.write(bytes, 0, length);
            }
            baos.close();
            zipIs.closeEntry();
            zipIs.close();

            logger.info("Size after decompressing:\t{} B", baos.size());

            final InputStream is = new ByteArrayInputStream(baos.toByteArray());
            final XStream xStream = new XStream();
            project = (Project)xStream.fromXML(is);

            logger.info("Successfully imported from zip file.");
        } catch (RuntimeException eZip) {
            final String zipMessage = new StringBuilder("Failed to import from zip file:\t").append(eZip.getMessage()).toString();
            logger.error(zipMessage);

            try {
                logger.info("Trying import project from xml file...");

                final XStream xStream = new XStream();
                project = (Project)xStream.fromXML(importFile.getInputStream());

                logger.info("Successfully imported from xml file.");
            } catch (RuntimeException eXml) {
                final String xmlMessage = new StringBuilder("Failed to import form xml file:\t").append(eXml.getMessage()).toString();
                logger.error(xmlMessage);

                WrongParameterException ex;
                if (importFile.getOriginalFilename().endsWith(".zip")) {
                    ex = new WrongParameterException(zipMessage);
                } else if (importFile.getOriginalFilename().endsWith(".xml")) {
                    ex = new WrongParameterException(xmlMessage);
                } else {
                    ex = new WrongParameterException("Wrong file. File should be written in a valid zip or xml format.");
                }

                throw ex;
            }
        }

        // change project's id - imported projects from same file can be recognized during one session of RuLeStudio
        project.setId(UUID.randomUUID());

        projectsContainer.addProject(project);
        return project;
    }
}
