package pl.put.poznan.rulestudio.rest;

import javafx.util.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.enums.OrderByRuleCharacteristic;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.RulesFormat;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.RulesWithHttpParameters;
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
    public ResponseEntity<RulesWithHttpParameters> getRules (
            @PathVariable("id") UUID id,
            @RequestParam(name = "orderBy", defaultValue = "none") OrderByRuleCharacteristic orderBy,
            @RequestParam(name = "desc", defaultValue = "true") Boolean desc) {
        logger.info("Getting rules...");
        RulesWithHttpParameters result = rulesService.getRules(id, orderBy, desc);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RulesWithHttpParameters> putRules (
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "typeOfRules") RuleType typeOfRules) {
        logger.info("Putting rules...");
        RulesWithHttpParameters result = rulesService.putRules(id, typeOfUnions, consistencyThreshold, typeOfRules);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RulesWithHttpParameters> postRules (
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "typeOfRules") RuleType typeOfRules,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting rules...");
        RulesWithHttpParameters result = rulesService.postRules(id, typeOfUnions, consistencyThreshold, typeOfRules, metadata, data);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public ResponseEntity<Resource> download(
            @PathVariable("id") UUID id,
            @RequestParam(name = "format") RulesFormat rulesFormat) throws IOException {
        logger.info("Downloading file");
        Pair<String, Resource> p = rulesService.download(id, rulesFormat);
        String projectName = p.getKey();
        Resource resource = p.getValue();

        switch (rulesFormat) {
            case XML:
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + projectName + " rules.xml")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_XML_VALUE)
                        .body(resource);
            case TXT:
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

    @RequestMapping(value = "/arePossibleRulesAllowed", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Boolean>> arePossibleRulesAllowed(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("Checking if possible rules are allowed");
        Boolean result = rulesService.arePossibleRulesAllowed(id);
        return ResponseEntity.ok(Collections.singletonMap("arePossibleRulesAllowed", result));
    }
}
