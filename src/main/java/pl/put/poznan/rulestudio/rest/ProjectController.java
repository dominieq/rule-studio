package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.model.ValidityProjectContainer;
import pl.put.poznan.rulestudio.model.response.ProjectDetailsResponse;
import pl.put.poznan.rulestudio.model.response.ProjectResponse;
import pl.put.poznan.rulestudio.service.ProjectService;

import java.io.IOException;
import java.util.UUID;

@CrossOrigin
@RequestMapping("/projects/{id}")
@RestController
public class ProjectController {

    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ValidityProjectContainer> getProject(
            @PathVariable("id") UUID id) {
        logger.info("[START] Getting project...");

        final ValidityProjectContainer result = projectService.getProject(id);

        logger.info("[ END ] Getting project is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ValidityProjectContainer> setProject(
            @PathVariable(name = "id") UUID id,
            @RequestParam(name = "metadata", required = false) MultipartFile metadataFile,
            @RequestParam(name = "data", required = false) MultipartFile dataFle,
            @RequestParam(name = "separator", defaultValue = ",") Character separator,
            @RequestParam(name = "header", defaultValue = "false") Boolean header) throws IOException {
        logger.info("[START] Setting project...");

        final ValidityProjectContainer result = projectService.setProject(id, metadataFile, dataFle, separator, header);

        logger.info("[ END ] Setting project is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectResponse> renameProject(
            @PathVariable("id") UUID id,
            @RequestParam("name") String name) {
        logger.info("[START] Renaming project...");

        final ProjectResponse result = projectService.renameProject(id, name);

        logger.info("[ END ] Renaming project is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity deleteProject(
            @PathVariable("id") UUID id) {
        logger.info("[START] Deleting project...");

        projectService.deleteProject(id);

        logger.info("[ END ] Deleting project is done.");
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/details", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectDetailsResponse> getDetails(
            @PathVariable("id") UUID id) {
        logger.info("[START] Getting project details...");

        final ProjectDetailsResponse projectDetailsResponse = projectService.getDetails(id);

        logger.info("[ END ] Getting project details is done.");
        return ResponseEntity.ok(projectDetailsResponse);
    }
}
