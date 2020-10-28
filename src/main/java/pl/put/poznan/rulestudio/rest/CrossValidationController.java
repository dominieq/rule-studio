package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.enums.*;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.service.CrossValidationService;

import java.io.IOException;
import java.util.UUID;

@CrossOrigin
@RequestMapping("projects/{id}/crossValidation")
@RestController
public class CrossValidationController {

    private static final Logger logger = LoggerFactory.getLogger(CrossValidationController.class);

    private final CrossValidationService crossValidationService;

    @Autowired
    public CrossValidationController(CrossValidationService crossValidationService) {
        this.crossValidationService = crossValidationService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainCrossValidationResponse> getCrossValidation(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("Getting cross validation...");

        final MainCrossValidationResponse result = crossValidationService.getCrossValidation(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainCrossValidationResponse> putCrossValidation(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "typeOfRules") RuleType typeOfRules,
            @RequestParam(name = "typeOfClassifier") ClassifierType typeOfClassifier,
            @RequestParam(name = "defaultClassificationResult") DefaultClassificationResultType defaultClassificationResult,
            @RequestParam(name = "numberOfFolds") Integer numberOfFolds,
            @RequestParam(name = "seed", defaultValue = "0") Long seed) {
        logger.info("Putting cross validation...");

        final MainCrossValidationResponse result = crossValidationService.putCrossValidation(id, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, numberOfFolds, seed);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainCrossValidationResponse> postCrossValidation(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "typeOfRules") RuleType typeOfRules,
            @RequestParam(name = "typeOfClassifier") ClassifierType typeOfClassifier,
            @RequestParam(name = "defaultClassificationResult") DefaultClassificationResultType defaultClassificationResult,
            @RequestParam(name = "numberOfFolds") Integer numberOfFolds,
            @RequestParam(name = "seed", defaultValue = "0") Long seed,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting cross validation...");

        final MainCrossValidationResponse result = crossValidationService.postCrossValidation(id, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, numberOfFolds, seed, metadata, data);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> getDescriptiveAttributes (
            @PathVariable("id") UUID id) {
        logger.info("Getting descriptive attributes in cross validation...");

        final DescriptiveAttributesResponse result = crossValidationService.getDescriptiveAttributes(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> postDescriptiveAttributes(
            @PathVariable("id") UUID id,
            @RequestParam(name = "objectVisibleName", required = false) String objectVisibleName) {
        logger.info("Posting descriptive attributes in cross validation...");

        final DescriptiveAttributesResponse result = crossValidationService.postDescriptiveAttributes(id, objectVisibleName);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/objectNames", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AttributeFieldsResponse> getObjectNames(
            @PathVariable("id") UUID id,
            @RequestParam(name = "subject", required = false) Integer foldIndex,
            @RequestParam(name = "set", required = false) Integer rulesIndex) {
        logger.info("Getting object names in cross validation...");

        AttributeFieldsResponse result;
        if((foldIndex != null) && (rulesIndex != null)) {
            result = crossValidationService.getObjectNames(id, foldIndex, rulesIndex);
        } else if(foldIndex != null) {
            result = crossValidationService.getObjectNames(id, foldIndex);
        } else {
            result = crossValidationService.getObjectNames(id);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{foldIndex}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChosenCrossValidationFoldResponse> getChosenCrossValidationFold(
            @PathVariable("id") UUID id,
            @PathVariable("foldIndex") Integer foldIndex) throws IOException {
        logger.info("Getting chosen cross validation fold...");

        final ChosenCrossValidationFoldResponse result = crossValidationService.getChosenCrossValidationFold(id, foldIndex);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{foldIndex}/object", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChosenClassifiedObjectAbstractResponse> getChosenClassifiedObject(
            @PathVariable("id") UUID id,
            @PathVariable("foldIndex") Integer foldIndex,
            @RequestParam("objectIndex") Integer objectIndex,
            @RequestParam(name = "isAttributes", defaultValue = "false") Boolean isAttributes) throws IOException {
        logger.info("Getting chosen classified object...");

        final ChosenClassifiedObjectAbstractResponse result = crossValidationService.getChosenClassifiedObject(id, foldIndex, objectIndex, isAttributes);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{foldIndex}/rules/{ruleIndex}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RuleMainPropertiesResponse> getRule(
            @PathVariable("id") UUID id,
            @PathVariable("foldIndex") Integer foldIndex,
            @PathVariable("ruleIndex") Integer ruleIndex) throws IOException {
        logger.info("Getting rule from cross validation...");

        final RuleMainPropertiesResponse result = crossValidationService.getRule(id, foldIndex, ruleIndex);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{foldIndex}/rules/{ruleIndex}/coveringObjects", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChosenRuleResponse> getRuleCoveringObjects(
            @PathVariable("id") UUID id,
            @PathVariable("foldIndex") Integer foldIndex,
            @PathVariable("ruleIndex") Integer ruleIndex) throws IOException {
        logger.info("Getting rule covering objects from cross validation...");

        final ChosenRuleResponse result = crossValidationService.getRuleCoveringObjects(id, foldIndex, ruleIndex);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/object", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObjectAbstractResponse> getObject(
            @PathVariable("id") UUID id,
            @RequestParam("objectIndex") Integer objectIndex,
            @RequestParam(name = "isAttributes", defaultValue = "false") Boolean isAttributes) throws IOException {
        logger.info("Getting object from cross validation...");

        final ObjectAbstractResponse result = crossValidationService.getObject(id, objectIndex, isAttributes);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/misclassificationMatrix", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrdinalMisclassificationMatrixAbstractResponse> getMisclassificationMatrix(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfMatrix") MisclassificationMatrixType typeOfMatrix,
            @RequestParam(name = "numberOfFold", required = false) Integer numberOfFold) {
        logger.info("Getting misclassification matrix from cross validation...");

        final OrdinalMisclassificationMatrixAbstractResponse result = crossValidationService.getMisclassificationMatrix(id, typeOfMatrix, numberOfFold);

        return ResponseEntity.ok(result);
    }
}
