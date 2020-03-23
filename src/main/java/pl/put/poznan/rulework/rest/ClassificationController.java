package pl.put.poznan.rulework.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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
        logger.info("Getting classification...");
        Classification result = classificationService.getClassification(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Classification> putClassification(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfClassifier") String typeOfClassifier,
            @RequestParam(name = "defaultClassificationResult") String defaultClassificationResult,
            @RequestParam(name = "data", required = false) MultipartFile dataFile,
            @RequestParam(name = "separator", defaultValue = ",") Character separator,
            @RequestParam(name = "header", defaultValue = "false") Boolean header) throws IOException {
        logger.info("Putting classification...");

        Classification result = null;
        if(dataFile != null) {
            result = classificationService.putClassificationNewData(id, typeOfClassifier, defaultClassificationResult, dataFile, separator, header);
        } else {
            result = classificationService.putClassification(id, typeOfClassifier, defaultClassificationResult);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Classification> postClassification(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfClassifier") String typeOfClassifier,
            @RequestParam(name = "defaultClassificationResult") String defaultClassificationResult,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting classification...");

        Classification result = classificationService.postClassification(id, typeOfClassifier, defaultClassificationResult, metadata, data);

        return ResponseEntity.ok(result);
    }
}
