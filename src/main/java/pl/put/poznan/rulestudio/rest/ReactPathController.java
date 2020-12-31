package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@Controller
public class ReactPathController {

    private static final Logger logger = LoggerFactory.getLogger(ReactPathController.class);

    @RequestMapping(value = {"/{id}/data","/{id}/cones","/{id}/unions","/{id}/rules","/{id}/classification","/{id}/crossvalidation"})
    public String returnIndexForTabs(
            @PathVariable("id") String id) {
        logger.info("Getting appropriate tab for project with id = " + id + "...");

        return "../index.html";
    }

    @RequestMapping(value = {"/help","/home","/newProject"})
    public String returnIndexForBody() {
        logger.info("Getting appropriate body...");

        return "index.html";
    }
}