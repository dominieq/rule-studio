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
import pl.put.poznan.rulestudio.model.parameters.ClassificationParameters;
import pl.put.poznan.rulestudio.model.parameters.ClassificationParametersImpl;
import pl.put.poznan.rulestudio.model.response.*;
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
            @PathVariable("id") UUID id) {
        logger.info("Getting classification...");

        final MainClassificationResponse result = classificationService.getClassification(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainClassificationResponse> putClassification(
            @PathVariable("id") UUID id,
            @RequestParam(name = "classifierType") ClassifierType classifierType,
            @RequestParam(name = "defaultClassificationResultType") DefaultClassificationResultType defaultClassificationResultType,
            @RequestParam(name = "externalDataFile", required = false) MultipartFile externalDataFile,
            @RequestParam(name = "separator", defaultValue = ",") Character separator,
            @RequestParam(name = "header", defaultValue = "false") Boolean header) throws IOException {
        logger.info("Putting classification...");

        final ClassificationParameters classificationParameters = new ClassificationParametersImpl(classifierType, defaultClassificationResultType);

        MainClassificationResponse result = null;
        if(externalDataFile != null) {
            result = classificationService.putClassificationNewData(id, classificationParameters, externalDataFile, separator, header);
        } else {
            result = classificationService.putClassification(id, classificationParameters);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainClassificationResponse> postClassification(
            @PathVariable("id") UUID id,
            @RequestParam(name = "classifierType") ClassifierType classifierType,
            @RequestParam(name = "defaultClassificationResultType") DefaultClassificationResultType defaultClassificationResultType,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data,
            @RequestParam(name = "externalDataFile", required = false) MultipartFile externalDataFile,
            @RequestParam(name = "separator", defaultValue = ",") Character separator,
            @RequestParam(name = "header", defaultValue = "false") Boolean header) throws IOException {
        logger.info("Posting classification...");

        final ClassificationParameters classificationParameters = new ClassificationParametersImpl(classifierType, defaultClassificationResultType);

        MainClassificationResponse result = null;
        if(externalDataFile != null) {
            result = classificationService.postClassificationNewData(id, classificationParameters, metadata, data, externalDataFile, separator, header);
        } else {
            result = classificationService.postClassification(id, classificationParameters, metadata, data);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> getDescriptiveAttributes (
            @PathVariable("id") UUID id) {
        logger.info("Getting descriptive attributes in classification...");

        final DescriptiveAttributesResponse result = classificationService.getDescriptiveAttributes(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> postDescriptiveAttributes(
            @PathVariable("id") UUID id,
            @RequestParam(name = "objectVisibleName", required = false) String objectVisibleName) {
        logger.info("Posting descriptive attributes in classification...");

        final DescriptiveAttributesResponse result = classificationService.postDescriptiveAttributes(id, objectVisibleName);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/objectNames", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AttributeFieldsResponse> getObjectNames(
            @PathVariable("id") UUID id) {
        logger.info("Getting object names in classification...");

        final AttributeFieldsResponse result = classificationService.getObjectNames(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/object", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChosenClassifiedObjectAbstractResponse> getChosenClassifiedObject(
            @PathVariable("id") UUID id,
            @RequestParam("objectIndex") Integer objectIndex,
            @RequestParam(name = "isAttributes", defaultValue = "false") Boolean isAttributes) throws IOException {
        logger.info("Getting chosen classified object...");

        final ChosenClassifiedObjectAbstractResponse result = classificationService.getChosenClassifiedObject(id, objectIndex, isAttributes);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/rules/{ruleIndex}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RuleMainPropertiesResponse> getRule(
            @PathVariable("id") UUID id,
            @PathVariable("ruleIndex") Integer ruleIndex) {
        logger.info("Getting rule from classification...");

        final RuleMainPropertiesResponse result = classificationService.getRule(id, ruleIndex);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/rules/descriptiveAttributes", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> getRulesDescriptiveAttributes (
            @PathVariable("id") UUID id) {
        logger.info("Getting rules descriptive attributes in classification...");

        final DescriptiveAttributesResponse result = classificationService.getRulesDescriptiveAttributes(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/rules/descriptiveAttributes", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> postRulesDescriptiveAttributes(
            @PathVariable("id") UUID id,
            @RequestParam(name = "objectVisibleName", required = false) String objectVisibleName) {
        logger.info("Posting rules descriptive attributes in classification...");

        final DescriptiveAttributesResponse result = classificationService.postRulesDescriptiveAttributes(id, objectVisibleName);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/rules/objectNames", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AttributeFieldsResponse> getRulesObjectNames(
            @PathVariable("id") UUID id,
            @RequestParam(name = "subject", required = false) Integer ruleIndex) {
        logger.info("Getting rules object names in classification...");

        AttributeFieldsResponse result;
        if(ruleIndex != null) {
            result = classificationService.getRulesObjectNames(id, ruleIndex);
        } else {
            result = classificationService.getRulesObjectNames(id);
        }

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/rules/{ruleIndex}/coveringObjects", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChosenRuleResponse> getRuleCoveringObjects(
            @PathVariable("id") UUID id,
            @PathVariable("ruleIndex") Integer ruleIndex) {
        logger.info("Getting rule covering objects...");

        final ChosenRuleResponse result = classificationService.getRuleCoveringObjects(id, ruleIndex);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/rules/object", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObjectAbstractResponse> getRulesObject(
            @PathVariable("id") UUID id,
            @RequestParam("objectIndex") Integer objectIndex,
            @RequestParam(name = "isAttributes", defaultValue = "false") Boolean isAttributes) throws IOException {
        logger.info("Getting object from rules from classification...");

        final ObjectAbstractResponse result = classificationService.getRulesObject(id, objectIndex, isAttributes);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/misclassificationMatrix", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrdinalMisclassificationMatrixWithoutDeviationResponse> getMisclassificationMatrix(
            @PathVariable("id") UUID id) {
        logger.info("Getting misclassification matrix from classification...");

        final OrdinalMisclassificationMatrixWithoutDeviationResponse result = classificationService.getMisclassificationMatrix(id);

        return ResponseEntity.ok(result);
    }
}
