package pl.put.poznan.rulework.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.service.ImportService;

import java.io.IOException;

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

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> uploadFile(
            @RequestParam("metadata") MultipartFile metadataFile,
            @RequestParam("data") MultipartFile dataFile) throws IOException {

        logger.info("Importing data");
        String result = importService.importData(metadataFile, dataFile);
        return ResponseEntity.ok(result);
    }
}
