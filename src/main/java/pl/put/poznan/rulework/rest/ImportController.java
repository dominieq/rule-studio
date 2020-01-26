package pl.put.poznan.rulework.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.service.ImportService;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

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

    /*@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity< HashMap<UUID, Project> > getData(
            @RequestParam("id") UUID id) {

        logger.info("Getting data");
        HashMap<UUID, Project> result = importService.getData(id);
        return ResponseEntity.ok(result);
    }*/

    /*@RequestMapping(value = "/project", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> getProject() {

        logger.info("Getting first project");
        Project result = importService.getProject();
        return ResponseEntity.ok(result);
    }*/

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> createProjectWithData(
            @RequestParam("name") String name,
            @RequestParam("metadata") MultipartFile metadataFile,
            @RequestParam("data") MultipartFile dataFile) throws IOException {

        logger.info("Importing data");
        Project result = importService.createProjectWithData(name, metadataFile, dataFile);
        return ResponseEntity.ok(result);
    }
}
