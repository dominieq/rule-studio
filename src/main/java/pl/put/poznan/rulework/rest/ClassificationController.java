package pl.put.poznan.rulework.rest;

import org.rulelearn.classification.SimpleClassificationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulework.model.Classification;
import pl.put.poznan.rulework.service.ClassificationService;

import java.io.IOException;
import java.util.UUID;

@CrossOrigin
@RequestMapping("projects/{id}/classification")
@RestController
public class ClassificationController {

    private static final Logger logger = LoggerFactory.getLogger(ClassificationController.class);

    private final ClassificationService classificationService;

    @Autowired
    public ClassificationController(ClassificationService classificationService) {
        this.classificationService = classificationService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Classification> getClassification(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("Getting classification");
        Classification result = classificationService.getClassification(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Classification> putClassification(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("Putting classification");
        Classification result = classificationService.putClassification(id);

        return ResponseEntity.ok(result);
    }
}
