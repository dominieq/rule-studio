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
import pl.put.poznan.rulestudio.model.response.ProjectResponse;

import java.io.*;
import java.util.UUID;
import java.util.zip.ZipInputStream;

@Service
public class ImportService {

    private static final Logger logger = LoggerFactory.getLogger(ImportService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public ProjectResponse postImport(MultipartFile importFile) throws IOException {
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
            project = readXml(is);

            logger.info("Successfully imported from zip file.");
        } catch (RuntimeException | ClassNotFoundException eZip) {
            final String zipMessage = new StringBuilder("Failed to import from zip file:\t").append(eZip.getMessage()).toString();
            logger.error(zipMessage);

            try {
                logger.info("Trying import project from xml file...");

                final InputStream is = importFile.getInputStream();
                project = readXml(is);

                logger.info("Successfully imported from xml file.");
            } catch (RuntimeException | ClassNotFoundException eXml) {
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

        ProjectResponse projectResponse = new ProjectResponse(project);
        logger.debug(projectResponse.toString());
        return projectResponse;
    }

    private Project readXml(InputStream is) throws IOException, ClassNotFoundException {
        String version;

        final XStream xStream = new XStream();
        ObjectInputStream ois = xStream.createObjectInputStream(is);

        try {
            version = (String)ois.readObject();
        } catch (RuntimeException e) {
            if (e.getMessage().equals("id")) {
                final String errorMessage = "There is no version in uploaded file, import can't be performed safely.";
                throw new RuntimeException(errorMessage);
            } else {
                throw e;
            }
        }

        if(!ExportService.version.equals(version)) {
            final String errorMessage = new StringBuilder("The version of the imported project (").append(version).append(") is not compatible with the version supported by application (").append(ExportService.version).append(").").toString();
            throw new RuntimeException(errorMessage);
        }

        final Project project = (Project)ois.readObject();
        return project;
    }
}
