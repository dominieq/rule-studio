package pl.put.poznan.rulework.rest;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulework.service.UnionsWithSingleLimitingDecisionService;

import java.io.IOException;
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
    public ResponseEntity<UnionsWithSingleLimitingDecision> getUnionsWithSingleLimitingDecision(
            @PathVariable("id") UUID id) {
        logger.info("Getting unions with single limiting decision...");

        UnionsWithSingleLimitingDecision result = unionsWithSingleLimitingDecisionService.getUnionsWithSingleLimitingDecision(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UnionsWithSingleLimitingDecision> putUnionsWithSingleLimitingDecision(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") String typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold) {
        logger.info("Putting unions with single limiting decision...");

        UnionsWithSingleLimitingDecision result = unionsWithSingleLimitingDecisionService.putUnionsWithSingleLimitingDecision(id, typeOfUnions, consistencyThreshold);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UnionsWithSingleLimitingDecision> postUnionsWithSingleLimitingDecision(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") String typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting unions with single limiting decision...");

        UnionsWithSingleLimitingDecision result = unionsWithSingleLimitingDecisionService.postUnionsWithSingleLimitingDecision(id, typeOfUnions, consistencyThreshold, metadata, data);

        return ResponseEntity.ok(result);
    }
}
