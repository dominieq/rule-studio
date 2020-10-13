package pl.put.poznan.rulestudio.rest;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;

@CrossOrigin
@Controller
public class InvalidPathController implements ErrorController {
    private static final String PATH = "/error";

    @RequestMapping(value = PATH)
    public String error(HttpServletRequest request) {
        return "index.html";
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }
}