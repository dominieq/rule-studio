package pl.put.poznan.rulework.rest;

import org.rulelearn.data.InformationTable;
import org.rulelearn.data.InformationTableBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@CrossOrigin
@RequestMapping("/import")
@RestController
public class ImportController {

    private static final Logger logger = LoggerFactory.getLogger(ImportController.class);

    public static InformationTable informationTable;

    @PostMapping
    public String uploadFile(
            @RequestParam("metadata") MultipartFile metadataFile,
            @RequestParam("data") MultipartFile dataFile,
            @RequestParam("format") String format) throws IOException {

        logger.info("Current location: " + System.getProperty("user.dir"));
        logger.info("File's format: " + format);

        String tmpDirName = "tmpDir/";
        File tmpDir = new File(tmpDirName);
        if(!tmpDir.exists()) {
            tmpDir.mkdir();
        }

        String pathMetadata = tmpDirName + metadataFile.getOriginalFilename();
        byte[] bytes = metadataFile.getBytes();
        Path path = Paths.get(pathMetadata);
        Files.write(path, bytes);

        String pathData = tmpDirName + dataFile.getOriginalFilename();
        bytes = dataFile.getBytes();
        path = Paths.get(pathData);
        Files.write(path, bytes);

        String formatData = format;

        logger.info("metadata:\t" + metadataFile.getContentType());
        logger.info("data:\t" + dataFile.getContentType());

        informationTable = null;
        try {
            if(formatData.equals("csv")) {
                informationTable = InformationTableBuilder.safelyBuildFromCSVFile(pathMetadata, pathData, true, ',');
            } else {
                informationTable = InformationTableBuilder.safelyBuildFromJSONFile(pathMetadata, pathData);
            }
        }
        catch (FileNotFoundException e) {
            logger.error(e.getMessage(), e);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }

        if(informationTable != null) {
            logger.info("Information table read from file.");
            logger.info("# objects: " + informationTable.getNumberOfObjects());
        } else {
            logger.info("Error reading information table from json file.");
        }

        return "End of uploadFile (POST)";
    }
}
