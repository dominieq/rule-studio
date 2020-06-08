package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.service.ImportService;

import java.io.IOException;

@CrossOrigin
@RequestMapping("/projects/import")
@RestController
public class ImportController {

    private static final Logger logger = LoggerFactory.getLogger(ImportController.class);

    private final ImportService importService;

    @Autowired
    public ImportController(ImportService importService) {
        this.importService = importService;
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> getImport(
            @RequestParam(name = "importFile") MultipartFile importFile) throws IOException, ClassNotFoundException {
        logger.info("Getting import...");

        Project result = importService.getImport(importFile);

        logger.info(result.toString());
        return ResponseEntity.ok(result);
    }
}
