package pl.put.poznan.rulework.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.service.ImportService;

import java.io.IOException;
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

    @RequestMapping(value = "/data/getData", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getData(
            @RequestParam("id") UUID id) throws IOException {

        logger.info("Getting data");
        String result = importService.getData(id);

        if(result == null) {
            logger.info("No project with given id");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/data/getMetadata", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getMetadata(
            @RequestParam("id") UUID id) throws IOException {

        logger.info("Getting metadata");
        String result = importService.getMetadata(id);

        if(result == null) {
            logger.info("No project with given id");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/data/getDataAndMetadata", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getDataAndMetadata(
            @RequestParam("id") UUID id) throws IOException {

        logger.info("Getting data and metadata");
        String result = importService.getDataAndMetadata(id);

        if(result == null) {
            logger.info("No project with given id");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/data/createProjectWithData", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> createProjectWithData(
            @RequestParam("name") String name,
            @RequestParam("metadata") MultipartFile metadataFile,
            @RequestParam("data") MultipartFile dataFile) throws IOException {

        logger.info("Creating project with data");
        Project result = importService.createProjectWithData(name, metadataFile, dataFile);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/data/createProjectWithMetadata", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> createProjectWithMetadata(
            @RequestParam("name") String name,
            @RequestParam("metadata") MultipartFile metadataFile) throws IOException {

        logger.info("Creating project with metadata");
        Project result = importService.createProjectWithMetadata(name, metadataFile);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/data/updateDataAndMetadata", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> updateDataAndMetadata(
            @RequestParam("id") UUID id,
            @RequestParam("metadata") MultipartFile metadataFile,
            @RequestParam("data") MultipartFile dataFile) throws IOException {

        logger.info("Updating data and metadata");
        Project result = importService.updateDataAndMetadata(id, metadataFile, dataFile);

        if(result == null) {
            logger.info("No project with given id");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/data/updateData", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> updateData(
            @RequestParam("id") UUID id,
            @RequestParam("data") MultipartFile dataFile) throws IOException {

        logger.info("Updating data");
        Project result = importService.updateData(id, dataFile);

        if(result == null) {
            logger.info("No project with given id");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/data/updateMetadata", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> updateMetadata(
            @RequestParam("id") UUID id,
            @RequestParam("metadata") MultipartFile metadataFile) throws IOException {

        logger.info("Updating metadata");
        Project result = importService.updateMetadata(id, metadataFile);

        if(result == null) {
            logger.info("No project with given id");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok(result);
    }
}
