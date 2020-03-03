package pl.put.poznan.rulework.rest;

import org.rulelearn.approximations.Unions;
import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulework.service.UnionsWithSingleLimitingDecisionService;

import java.util.UUID;

@CrossOrigin
@RequestMapping("projects/{id}/unions")
@RestController
public class UnionsWithSingleLimitingDecisionController {

    private static final Logger logger = LoggerFactory.getLogger(UnionsWithSingleLimitingDecisionController.class);

    private final UnionsWithSingleLimitingDecisionService unionsWithSingleLimitingDecisionService;

    @Autowired
    public UnionsWithSingleLimitingDecisionController(UnionsWithSingleLimitingDecisionService unionsWithSingleLimitingDecisionService) {
        this.unionsWithSingleLimitingDecisionService = unionsWithSingleLimitingDecisionService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UnionsWithSingleLimitingDecision> getDominanceCones(
            @PathVariable("id") UUID id,
            @RequestParam(name = "consistencyThreshold", required = false) Double consistencyThreshold) {
        logger.info("Getting unions with single limiting decision...");

        UnionsWithSingleLimitingDecision result = unionsWithSingleLimitingDecisionService.getUnionsWithSingleLimitingDecision(id, consistencyThreshold);

        return ResponseEntity.ok(result);
    }
}
