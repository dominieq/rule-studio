package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RequestMapping(value = "/{id}")
@Controller
public class ReactPathController {

    private static final Logger logger = LoggerFactory.getLogger(ReactPathController.class);

    @RequestMapping(value = {"/data","/cones","/unions","/rules","/classification","/crossvalidation"})
    public String returnIndex(
            @PathVariable("id") String id) {
        logger.info("Getting appropriate tab for project with id = " + id);

        return "../index.html";
    }
}