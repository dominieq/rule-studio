package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.enums.ProjectFormat;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.NamedResource;
import pl.put.poznan.rulestudio.service.ExportService;

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
            @PathVariable("id") UUID id,
            @RequestParam("format") ProjectFormat projectFormat) {
        logger.info("Getting export...");
        NamedResource namedResource = exportService.getExport(id, projectFormat);
        String projectName = namedResource.getName();
        Resource resource = namedResource.getResource();

        switch (projectFormat) {
            case XML:
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " export.xml")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_XML_VALUE)
                        .body(resource);
            case JSON:
                WrongParameterException ex = new WrongParameterException(String.format("Given format of project \"%s\" is not supported.", projectFormat));
                logger.error(ex.getMessage());
                throw ex;
            case BIN:
                ex = new WrongParameterException(String.format("Given format of project \"%s\" is not supported.", projectFormat));
                logger.error(ex.getMessage());
                throw ex;
            default:
                ex = new WrongParameterException(String.format("Given format of project \"%s\" is unrecognized.", projectFormat));
                logger.error(ex.getMessage());
                throw ex;
        }
    }
}
