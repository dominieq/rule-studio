package pl.put.poznan.rulework.rest;

import javafx.util.Pair;
import org.rulelearn.data.Attribute;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.service.MetadataService;

import java.io.IOException;
import java.util.UUID;

@CrossOrigin(exposedHeaders = {"Content-Disposition"})
@RequestMapping("projects/{id}/metadata")
@RestController
public class MetadataController {

    private static final Logger logger = LoggerFactory.getLogger(MetadataController.class);

    private final MetadataService metadataService;

    @Autowired
    public MetadataController(MetadataService metadataService) {
        this.metadataService = metadataService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Attribute[]> getMetadata(
            @PathVariable("id") UUID id) {
        logger.info("Getting metadata");
        Attribute[] result = metadataService.getMetadata(id);

        logger.info(result.toString());
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> putMetadata(
            @PathVariable("id") UUID id,
            @RequestBody String metadata) throws IOException {
        logger.info("Putting metadata");
        Project result = metadataService.putMetadata(id, metadata);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Resource> download(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("Downloading file");
        Pair<String, Resource> p = metadataService.download(id);
        String projectName = p.getKey();
        Resource resource = p.getValue();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + "_metadata.csv")
                .body(resource);
    }
}
