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

    //private static final Logger logger = LoggerFactory.getLogger(RuleLearnIndexController.class);
    private static final Logger logger = LoggerFactory.getLogger(ImportController.class);

    public static String pathMetadata;

    public static String pathData;

    public static String formatData;

    public static String pathRules;

    public static InformationTable informationTable;



    @GetMapping
    public String getImportedData() {
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

        return "ImportController.importData";
    }

    @PostMapping
    public String uploadFile(
            @RequestParam("file") MultipartFile multipartFile,
            @RequestParam("content") String content,
            @RequestParam(value = "format", required = false) String format) throws IOException {

        logger.info("Current location: " + System.getProperty("user.dir"));
        logger.info("File's content: " + content);
        logger.info("File's format: " + format);

        String tmpDirName = "tmpDir/";
        File tmpDir = new File(tmpDirName);
        if(!tmpDir.exists()) {
            tmpDir.mkdir();
        }

        String pathName = tmpDirName + multipartFile.getOriginalFilename();
        byte[] bytes = multipartFile.getBytes();
        Path path = Paths.get(pathName);
        Files.write(path, bytes);

        switch (content) {
            case "metadata": {
                pathMetadata = pathName;
                break;
            }
            case "data": {
                pathData = pathName;
                break;
            }
            case "rules": {
                pathRules = pathName;
                break;
            }
        }

        if(content.equals("data")) {
            formatData = format;
            logger.info("Format of data: " + formatData);
        }

        logger.info(multipartFile.getOriginalFilename());
        logger.info(multipartFile.getContentType());
        logger.info(multipartFile.getBytes().toString());

        return "End of executing upload.";
    }
}
