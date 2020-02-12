package pl.put.poznan.rulework.rest;

import org.rulelearn.approximations.Unions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulework.service.UnionsWithSingleLimitingDecisionService;

import java.util.UUID;

@CrossOrigin
@RequestMapping("/unions")
@RestController
public class UnionsWithSingleLimitingDecisionController {

    private static final Logger logger = LoggerFactory.getLogger(UnionsWithSingleLimitingDecisionController.class);

    private final UnionsWithSingleLimitingDecisionService unionsWithSingleLimitingDecisionService;

    @Autowired
    public UnionsWithSingleLimitingDecisionController(UnionsWithSingleLimitingDecisionService unionsWithSingleLimitingDecisionService) {
        this.unionsWithSingleLimitingDecisionService = unionsWithSingleLimitingDecisionService;
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Unions> calculate(
            @RequestParam("id")UUID id,
            @RequestParam("consistencyThreshold") double consistencyThreshold) {
        logger.info("Calculating unions with single limiting decision...");

        Unions result = unionsWithSingleLimitingDecisionService.calculate(id, consistencyThreshold);

        return ResponseEntity.ok(result);
    }
}
