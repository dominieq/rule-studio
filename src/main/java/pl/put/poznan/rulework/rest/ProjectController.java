package pl.put.poznan.rulework.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.service.ProjectService;

import java.util.ArrayList;
import java.util.UUID;

@CrossOrigin
@RequestMapping("/project")
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
            @RequestParam("id") UUID id) {

        logger.info("Getting project");
        Project result = projectService.getProject(id);

        if(result == null) {
            logger.info("No project with given id");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        logger.info(result.toString());
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity< ArrayList<Project> > getProjects() {

        logger.info("Getting projects");
        ArrayList<Project> result = projectService.getProjects();

        if(result == null) {
            logger.info("There is no projects");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        logger.info(result.toString());
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> createProject(
            @RequestParam("name") String name) {

        logger.info("Createing project");
        Project result = projectService.createProject(name);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> renameProject(
            @RequestParam("id") UUID id,
            @RequestParam("name") String name) {

        logger.info("Renaming project");
        Project result = projectService.renameProject(id, name);

        if(result == null) {
            logger.info("No project with given id");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteProject(
            @RequestParam("id") UUID id) {

        logger.info("Deleting project");
        String result = projectService.deleteProject(id);
        return ResponseEntity.ok(result);
    }
}
