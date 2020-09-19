package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.model.response.MainClassificationResponse;
import pl.put.poznan.rulestudio.service.ClassificationService;

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
    public ResponseEntity<MainClassificationResponse> getClassification(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("Getting classification...");

        MainClassificationResponse result = classificationService.getClassification(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainClassificationResponse> putClassification(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfClassifier") ClassifierType typeOfClassifier,
            @RequestParam(name = "defaultClassificationResult") DefaultClassificationResultType defaultClassificationResult,
            @RequestParam(name = "externalDataFile", required = false) MultipartFile externalDataFile,
            @RequestParam(name = "separator", defaultValue = ",") Character separator,
            @RequestParam(name = "header", defaultValue = "false") Boolean header) throws IOException {
        logger.info("Putting classification...");

        MainClassificationResponse result = null;
        if(externalDataFile != null) {
            result = classificationService.putClassificationNewData(id, typeOfClassifier, defaultClassificationResult, externalDataFile, separator, header);
        } else {
            result = classificationService.putClassification(id, typeOfClassifier, defaultClassificationResult);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainClassificationResponse> postClassification(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfClassifier") ClassifierType typeOfClassifier,
            @RequestParam(name = "defaultClassificationResult") DefaultClassificationResultType defaultClassificationResult,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data,
            @RequestParam(name = "externalDataFile", required = false) MultipartFile externalDataFile,
            @RequestParam(name = "separator", defaultValue = ",") Character separator,
            @RequestParam(name = "header", defaultValue = "false") Boolean header) throws IOException {
        logger.info("Posting classification...");

        MainClassificationResponse result = null;
        if(externalDataFile != null) {
            result = classificationService.postClassificationNewData(id, typeOfClassifier, defaultClassificationResult, metadata, data, externalDataFile, separator, header);
        } else {
            result = classificationService.postClassification(id, typeOfClassifier, defaultClassificationResult, metadata, data);
        }

        return ResponseEntity.ok(result);
    }
}
