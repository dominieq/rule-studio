package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.model.response.ProjectResponse;
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
    public ResponseEntity<ProjectResponse> postImport(
            @RequestParam(name = "importFile") MultipartFile importFile) throws IOException {
        logger.info("Posting import...");

        final ProjectResponse result = importService.postImport(importFile);

        return ResponseEntity.ok(result);
    }
}
