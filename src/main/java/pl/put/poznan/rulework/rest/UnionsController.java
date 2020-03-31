package pl.put.poznan.rulework.rest;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulework.enums.UnionType;
import pl.put.poznan.rulework.model.UnionsWithHttpParameters;
import pl.put.poznan.rulework.service.UnionsService;

import java.io.IOException;
import java.util.UUID;

@CrossOrigin
@RequestMapping("projects/{id}/unions")
@RestController
public class UnionsController {

    private static final Logger logger = LoggerFactory.getLogger(UnionsController.class);

    private final UnionsService unionsService;

    @Autowired
    public UnionsController(UnionsService unionsService) {
        this.unionsService = unionsService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UnionsWithHttpParameters> getUnions(
            @PathVariable("id") UUID id) {
        logger.info("Getting unions with single limiting decision...");

        UnionsWithHttpParameters result = unionsService.getUnions(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UnionsWithHttpParameters> putUnions(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold) {
        logger.info("Putting unions with single limiting decision...");

        UnionsWithHttpParameters result = unionsService.putUnions(id, typeOfUnions, consistencyThreshold);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UnionsWithHttpParameters> postUnions(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting unions with single limiting decision...");

        UnionsWithHttpParameters result = unionsService.postUnions(id, typeOfUnions, consistencyThreshold, metadata, data);

        return ResponseEntity.ok(result);
    }
}
