package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.model.NamedResource;
import pl.put.poznan.rulestudio.model.response.AttributesResponse;
import pl.put.poznan.rulestudio.model.response.GlobalDescriptiveAttributesResponse;
import pl.put.poznan.rulestudio.model.response.InformationTableResponse;
import pl.put.poznan.rulestudio.service.MetadataService;

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
    public ResponseEntity<AttributesResponse> getMetadata(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("[START] Getting metadata...");

        final AttributesResponse result = metadataService.getMetadata(id);

        logger.info("[ END ] Getting metadata is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InformationTableResponse> putMetadata(
            @PathVariable("id") UUID id,
            @RequestParam(name = "metadata") String metadata) throws IOException {
        logger.info("[START] Putting metadata...");

        final InformationTableResponse result = metadataService.putMetadata(id, metadata);

        logger.info("[ END ] Putting metadata is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Resource> getDownload(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("[START] Downloading server's metadata...");

        final NamedResource namedResource = metadataService.getDownload(id);
        final String projectName = namedResource.getName();
        final Resource resource = namedResource.getResource();

        logger.info("[ END ] Downloading server's metadata is done.");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " metadata.json")
                .body(resource);
    }

    @RequestMapping(value = "/download", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Resource> putDownload(
            @PathVariable("id") UUID id,
            @RequestParam(name = "metadata") String metadata) throws IOException {
        logger.info("[START] Downloading client's metadata...");

        final NamedResource namedResource = metadataService.putDownload(id, metadata);
        final String projectName = namedResource.getName();
        final Resource resource = namedResource.getResource();

        logger.info("[ END ] Downloading client's metadata is done.");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " metadata.json")
                .body(resource);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GlobalDescriptiveAttributesResponse> getDescriptiveAttributes(
            @PathVariable("id") UUID id) {
        logger.info("[START] Getting descriptive attributes in project...");

        final GlobalDescriptiveAttributesResponse result = metadataService.getGlobalDescriptiveAttributes(id);

        logger.info("[ END ] Getting descriptive attributes in project is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GlobalDescriptiveAttributesResponse> postDescriptiveAttributes(
            @PathVariable("id") UUID id,
            @RequestParam(name = "objectVisibleName", required = false) String objectVisibleName) {
        logger.info("[START] Posting descriptive attributes in project...");

        final GlobalDescriptiveAttributesResponse result = metadataService.postGlobalDescriptiveAttributes(id, objectVisibleName);

        logger.info("[ END ] Posting descriptive attributes in project is done.");
        return ResponseEntity.ok(result);
    }
}
