package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.model.Project;
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
    public ResponseEntity<Project> getProject(
            @PathVariable("id") UUID id) {

        logger.info("Getting project");
        Project result = projectService.getProject(id);

        logger.debug(result.toString());
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> setProject(
            @PathVariable(name = "id") UUID id,
            @RequestParam(name = "metadata", required = false) MultipartFile metadataFile,
            @RequestParam(name = "data", required = false) MultipartFile dataFle,
            @RequestParam(name = "rules", required = false) MultipartFile rulesFiles,
            @RequestParam(name = "separator", defaultValue = ",") Character separator,
            @RequestParam(name = "header", defaultValue = "false") Boolean header) throws IOException {

        logger.info("Setting project");
        Project result = projectService.setProject(id, metadataFile, dataFle, rulesFiles, separator, header);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> renameProject(
            @PathVariable("id") UUID id,
            @RequestParam("name") String name) {

        logger.info("Renaming project");
        Project result = projectService.renameProject(id, name);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity deleteProject(
            @PathVariable("id") UUID id) {

        logger.info("Deleting project");
        projectService.deleteProject(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
