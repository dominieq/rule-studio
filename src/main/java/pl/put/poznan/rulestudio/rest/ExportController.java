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
import pl.put.poznan.rulestudio.service.ExportService;

import java.io.IOException;
import java.util.UUID;

@CrossOrigin
@RequestMapping("/projects/{id}/export")
@RestController
public class ExportController {

    private static final Logger logger = LoggerFactory.getLogger(ExportController.class);

    private final ExportService exportService;

    @Autowired
    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Resource> getExport(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("Getting export...");
        NamedResource namedResource = exportService.getExport(id);
        String projectName = namedResource.getName();
        Resource resource = namedResource.getResource();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " export")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE)
                .body(resource);
    }
}
