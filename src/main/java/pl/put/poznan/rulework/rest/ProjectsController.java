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
import pl.put.poznan.rulework.service.ProjectsService;

import java.io.IOException;
import java.util.ArrayList;

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
    public ResponseEntity< ArrayList<Project> > getProjects() {

        logger.info("Getting projects");
        ArrayList<Project> result = projectsService.getProjects();

        logger.info(result.toString());
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> createProject(
            @RequestParam(name = "name") String name,
            @RequestParam(name = "metadata", required = false) MultipartFile metadataFile,
            @RequestParam(name = "data", required = false) MultipartFile dataFle,
            @RequestParam(name = "rules", required = false) MultipartFile rulesFiles) throws IOException {

        logger.info("Creating project");
        Project result = projectsService.createProject(name, metadataFile, dataFle, rulesFiles);
        return ResponseEntity.ok(result);
    }
}
