package pl.put.poznan.rulestudio.rest;

import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.enums.DataFormat;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.NamedResource;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.service.DataService;

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

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InformationTable> postData(
            @PathVariable("id") UUID id,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting data");
        InformationTable result = dataService.postData(id, metadata, data);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public ResponseEntity<Resource> getDownload(
            @PathVariable("id") UUID id,
            @RequestParam(name = "format") DataFormat format,
            @RequestParam(name = "separator", defaultValue = ",") String separator,
            @RequestParam(name = "header", defaultValue = "false") Boolean header) throws IOException {
        logger.info("Downloading server's data");
        logger.info("Format:\t{}", format);

        NamedResource namedResource;
        String projectName;
        Resource resource;

        switch (format) {
            case JSON:
                namedResource = dataService.getDownloadJson(id);
                projectName = namedResource.getName();
                resource = namedResource.getResource();

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " data.json")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .body(resource);
            case CSV:
                namedResource = dataService.getDownloadCsv(id, separator, header);
                projectName = namedResource.getName();
                resource = namedResource.getResource();

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " data.csv")
                        .header(HttpHeaders.CONTENT_TYPE, "text/csv")
                        .body(resource);
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given format of rules \"%s\" is unrecognized.", format));
                logger.error(ex.getMessage());
                throw ex;
        }
    }

    @RequestMapping(value = "/download", method = RequestMethod.PUT)
    public ResponseEntity<Resource> putDownload(
            @PathVariable("id") UUID id,
            @RequestParam(name = "format") DataFormat format,
            @RequestParam(name = "separator", defaultValue = ",") String separator,
            @RequestParam(name = "header", defaultValue = "false") Boolean header,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Downloading client's data");

        NamedResource namedResource;
        String projectName;
        Resource resource;

        switch (format) {
            case JSON:
                namedResource = dataService.putDownloadJson(id, metadata, data);
                projectName = namedResource.getName();
                resource = namedResource.getResource();

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " data.json")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .body(resource);
            case CSV:
                namedResource = dataService.putDownloadCsv(id, metadata, data, separator, header);
                projectName = namedResource.getName();
                resource = namedResource.getResource();

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " data.csv")
                        .header(HttpHeaders.CONTENT_TYPE, "text/csv")
                        .body(resource);
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given format of rules \"%s\" is unrecognized.", format));
                logger.error(ex.getMessage());
                throw ex;
        }
    }
}
