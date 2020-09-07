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
            ZipInputStream zipIs = new ZipInputStream(importFile.getInputStream());
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

            InputStream is = new ByteArrayInputStream(baos.toByteArray());
            XStream xStream = new XStream();
            project = (Project)xStream.fromXML(is);

            logger.info("Successfully imported from zip file.");
        } catch (RuntimeException eXml) {
            String xmlMessage = new StringBuilder("Failed to import from xml file:\t").append(eXml.getMessage()).toString();
            logger.error(xmlMessage);

            try {
                logger.info("Trying import from binary file...");

                WrongParameterException exBin = new WrongParameterException("Project import from binary file is not supported yet.");
                throw exBin;/*

                logger.info("Successfully imported from binary file.");*/
            } catch (RuntimeException eBin) {
                String binMessage = new StringBuilder("Failed to import form binary file:\t").append(eBin.getMessage()).toString();
                logger.error(binMessage);

                WrongParameterException ex;
                if (importFile.getOriginalFilename().endsWith(".xml")) {
                    ex = new WrongParameterException(xmlMessage);
                } else if (importFile.getOriginalFilename().endsWith(".bin")) {
                    ex = new WrongParameterException(binMessage);
                } else {
                    ex = new WrongParameterException("Wrong file. File should be written in a valid xml or binary format.");
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
