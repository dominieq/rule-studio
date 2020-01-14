package pl.put.poznan.rulework.rest;

import org.rulelearn.data.InformationTable;
import org.rulelearn.data.InformationTableBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.service.ImportService;

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

    private final ImportService importService;

    @Autowired
    public ImportController(ImportService importService) {
        this.importService = importService;
    }

    @PostMapping
    public String uploadFile(
            @RequestParam("metadata") MultipartFile metadataFile,
            @RequestParam("data") MultipartFile dataFile,
            @RequestParam("format") String format) throws IOException {

        logger.info("Importing data");
        return importService.importData(metadataFile, dataFile, format);
    }
}
