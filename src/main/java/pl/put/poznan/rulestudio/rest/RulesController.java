package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulestudio.enums.OrderByRuleCharacteristic;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.RulesFormat;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.NamedResource;
import pl.put.poznan.rulestudio.model.parameters.RulesParameters;
import pl.put.poznan.rulestudio.model.parameters.RulesParametersImpl;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.service.RulesService;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(exposedHeaders = {"Content-Disposition"})
@RequestMapping("/projects/{id}/rules")
@RestController
public class RulesController {

    private static final Logger logger = LoggerFactory.getLogger(RulesController.class);

    private final RulesService rulesService;

    @Autowired
    public RulesController(RulesService rulesService) {
        this.rulesService = rulesService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainRulesResponse> getRules (
            @PathVariable("id") UUID id,
            @RequestParam(name = "orderBy", defaultValue = "none") OrderByRuleCharacteristic orderBy,
            @RequestParam(name = "desc", defaultValue = "true") Boolean desc) {
        logger.info("[START] Getting rules...");

        final MainRulesResponse result = rulesService.getRules(id, orderBy, desc);

        logger.info("[ END ] Getting rules is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainRulesResponse> putRules (
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "typeOfRules") RuleType typeOfRules) {
        logger.info("[START] Putting rules...");

        final RulesParameters rulesParameters = RulesParametersImpl.getInstance(typeOfUnions, consistencyThreshold, typeOfRules);
        final MainRulesResponse result = rulesService.putRules(id, rulesParameters);

        logger.info("[ END ] Putting rules is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainRulesResponse> postRules (
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "typeOfRules") RuleType typeOfRules,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("[START] Posting rules...");

        final RulesParameters rulesParameters = RulesParametersImpl.getInstance(typeOfUnions, consistencyThreshold, typeOfRules);
        final MainRulesResponse result = rulesService.postRules(id, rulesParameters, metadata, data);

        logger.info("[ END ] Posting rules is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> getDescriptiveAttributes (
            @PathVariable("id") UUID id) {
        logger.info("[START] Getting descriptive attributes in rules...");

        final DescriptiveAttributesResponse result = rulesService.getDescriptiveAttributes(id);

        logger.info("[ END ] Getting descriptive attributes in rules is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> postDescriptiveAttributes(
            @PathVariable("id") UUID id,
            @RequestParam(name = "objectVisibleName", required = false) String objectVisibleName) {
        logger.info("[START] Posting descriptive attributes in rules...");

        final DescriptiveAttributesResponse result = rulesService.postDescriptiveAttributes(id, objectVisibleName);

        logger.info("[ END ] Posting descriptive attributes in rules is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/objectNames", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AttributeFieldsResponse> getObjectNames(
            @PathVariable("id") UUID id,
            @RequestParam(name = "subject", required = false) Integer ruleIndex) {
        logger.info("[START] Getting object names in rules...");

        AttributeFieldsResponse result;
        if(ruleIndex != null) {
            result = rulesService.getObjectNames(id, ruleIndex);
        } else {
            result = rulesService.getObjectNames(id);
        }

        logger.info("[ END ] Getting object names in rules is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public ResponseEntity<Resource> download(
            @PathVariable("id") UUID id,
            @RequestParam(name = "format") RulesFormat rulesFormat) {
        logger.info("[START] Downloading file...");
        NamedResource namedResource = rulesService.download(id, rulesFormat);
        String projectName = namedResource.getName();
        Resource resource = namedResource.getResource();

        switch (rulesFormat) {
            case XML:
                logger.info("[ END ] Downloading file is done.");
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " rules.xml")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_XML_VALUE)
                        .body(resource);
            case TXT:
                logger.info("[ END ] Downloading file is done.");
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " rules.txt")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                        .body(resource);
            default:
                WrongParameterException ex = new WrongParameterException(String.format("Given format of rules \"%s\" is unrecognized.", rulesFormat));
                logger.error(ex.getMessage());
                throw ex;
        }
    }

    @RequestMapping(value = "/upload", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainRulesResponse> putUploadRules (
            @PathVariable("id") UUID id,
            @RequestParam(name = "rules") MultipartFile rulesFile) throws IOException {
        logger.info("[START] Uploading rules (PUT)...");

        final MainRulesResponse result = rulesService.putUploadRules(id, rulesFile);

        logger.info("[ END ] Uploading rules (PUT) is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainRulesResponse> postUploadRules (
            @PathVariable("id") UUID id,
            @RequestParam(name = "rules") MultipartFile rulesFile,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("[START] Uploading rules (POST)...");

        final MainRulesResponse result = rulesService.postUploadRules(id, rulesFile, metadata, data);

        logger.info("[ END ] Uploading rules (POST) is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{ruleIndex}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChosenRuleResponse> getChosenRule (
            @PathVariable("id") UUID id,
            @PathVariable("ruleIndex") Integer ruleIndex) {
        logger.info("[START] Getting chosen rule...");

        final ChosenRuleResponse result = rulesService.getChosenRule(id, ruleIndex);

        logger.info("[ END ] Getting chosen rule is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/object", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObjectAbstractResponse> getObject (
            @PathVariable("id") UUID id,
            @RequestParam("objectIndex") Integer objectIndex,
            @RequestParam(name = "isAttributes", defaultValue = "false") Boolean isAttributes) throws IOException {
        logger.info("[START] Getting object from rules...");

        final ObjectAbstractResponse result = rulesService.getObject(id, objectIndex, isAttributes);

        logger.info("[ END ] Getting object from rules is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/arePossibleRulesAllowed", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Boolean>> arePossibleRulesAllowed(
            @PathVariable("id") UUID id) {
        logger.info("[START] Checking if possible rules are allowed...");

        Boolean result = rulesService.arePossibleRulesAllowed(id);

        logger.info("[ END ] Checking if possible rules are allowed is done.");
        return ResponseEntity.ok(Collections.singletonMap("arePossibleRulesAllowed", result));
    }
}
