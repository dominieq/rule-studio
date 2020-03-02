package pl.put.poznan.rulework.rest;

import org.rulelearn.rules.RuleSetWithCharacteristics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulework.service.RulesService;

import java.util.UUID;

@CrossOrigin
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
    public ResponseEntity<RuleSetWithCharacteristics> getRules (
            @PathVariable("id") UUID id) {
        logger.info("Getting rules...");
        RuleSetWithCharacteristics result = rulesService.getRules(id);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RuleSetWithCharacteristics> putRules (
            @PathVariable("id") UUID id) {
        logger.info("Putting rules...");
        RuleSetWithCharacteristics result = rulesService.putRules(id);
        return ResponseEntity.ok(result);
    }

}
