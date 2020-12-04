package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.model.response.ProjectResponse;
import pl.put.poznan.rulestudio.model.response.ProjectsResponse;
import pl.put.poznan.rulestudio.service.ProjectsService;

import java.io.IOException;

@CrossOrigin
@RequestMapping("/projects")
@RestController
public class ProjectsController {

    private static final Logger logger = LoggerFactory.getLogger(ProjectsController.class);

    private final ProjectsService projectsService;

    @Autowired
    public ProjectsController(ProjectsService projectsService) {
        this.projectsService = projectsService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectsResponse> getProjects() {
        logger.info("Getting projects...");

        final ProjectsResponse result = projectsService.getProjects();

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectResponse> createProject(
            @RequestParam(name = "name") String name,
            @RequestParam(name = "metadata", required = false) MultipartFile metadataFile,
            @RequestParam(name = "data", required = false) MultipartFile dataFle,
            @RequestParam(name = "rules", required = false) MultipartFile rulesFiles,
            @RequestParam(name = "separator", defaultValue = ",") Character separator,
            @RequestParam(name = "header", defaultValue = "false") Boolean header) throws IOException {
        logger.info("Creating project...");

        final ProjectResponse result = projectsService.createProject(name, metadataFile, dataFle, rulesFiles, separator, header);

        return ResponseEntity.ok(result);
    }
}
