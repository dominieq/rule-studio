package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.model.DominanceCones;
import pl.put.poznan.rulestudio.model.response.MainDominanceConesResponse;
import pl.put.poznan.rulestudio.service.DominanceConesService;

import java.io.IOException;
import java.util.UUID;

@CrossOrigin
@RequestMapping("projects/{id}/cones")
@RestController
public class DominanceConesController {

    private static final Logger logger = LoggerFactory.getLogger(DominanceConesController.class);

    private final DominanceConesService dominanceConesService;

    @Autowired
    public DominanceConesController(DominanceConesService dominanceConesService) {
        this.dominanceConesService = dominanceConesService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainDominanceConesResponse> getDominanceCones(
            @PathVariable("id") UUID id) {
        logger.info("Getting dominance cones...");

        MainDominanceConesResponse result = dominanceConesService.getDominanceCones(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainDominanceConesResponse> putDominanceCones(
            @PathVariable("id") UUID id) {
        logger.info("Putting dominance cones...");

        MainDominanceConesResponse result = dominanceConesService.putDominanceCones(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainDominanceConesResponse> postDominanceCones(
            @PathVariable("id") UUID id,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting dominance cones...");

        MainDominanceConesResponse result = dominanceConesService.postDominanceCones(id, metadata, data);

        return ResponseEntity.ok(result);
    }
}
