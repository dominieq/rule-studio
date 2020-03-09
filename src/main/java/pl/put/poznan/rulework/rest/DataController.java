package pl.put.poznan.rulework.rest;

import com.fasterxml.jackson.databind.node.ObjectNode;
import javafx.util.Pair;
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
import pl.put.poznan.rulework.service.DataService;

import java.io.IOException;
import java.util.UUID;

@CrossOrigin(exposedHeaders = {"Content-Disposition"})
@RequestMapping("projects/{id}/data")
@RestController
public class DataController {

    private static final Logger logger = LoggerFactory.getLogger(DataController.class);

    private final DataService dataService;

    @Autowired
    public DataController(DataService dataService) {
        this.dataService = dataService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getData(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("Getting data");
        String result = dataService.getData(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> putData(
            @PathVariable("id") UUID id,
            @RequestBody String data) throws IOException {
        logger.info("Putting data");
        Project result = dataService.putData(id, data);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public ResponseEntity<Resource> getDownload(
            @PathVariable("id") UUID id,
            @RequestParam(name = "format") String format) throws IOException {
        logger.info("Downloading server's data");

        Pair<String, Resource> p;
        String projectName;
        Resource resource;

        if(format.equals("json")) {
            p = dataService.getDownloadJson(id);
            projectName = p.getKey();
            resource = p.getValue();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + "_data.json")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .body(resource);
        } else {
            p = dataService.getDownloadCsv(id);
            projectName = p.getKey();
            resource = p.getValue();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + "_data.csv")
                    .header(HttpHeaders.CONTENT_TYPE, "text/csv")
                    .body(resource);
        }
    }

    @RequestMapping(value = "/download", method = RequestMethod.PUT)
    public ResponseEntity<Resource> putDownload(
            @PathVariable("id") UUID id,
            @RequestParam(name = "format") String format,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Downloading client's data");

        Pair<String, Resource> p;
        String projectName;
        Resource resource;

        if(format.equals("json")) {
            p = dataService.putDownloadJson(id, metadata, data);
            projectName = p.getKey();
            resource = p.getValue();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + "_data.json")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .body(resource);
        } else {
            p = dataService.putDownloadCsv(id, metadata, data);
            projectName = p.getKey();
            resource = p.getValue();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + "_data.csv")
                    .header(HttpHeaders.CONTENT_TYPE, "text/csv")
                    .body(resource);
        }
    }
}
