package pl.put.poznan.rulework.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulework.model.DominanceCones;
import pl.put.poznan.rulework.service.DominanceConesService;

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
    public ResponseEntity<DominanceCones> getDominanceCones(
            @PathVariable("id") UUID id) {
        logger.info("Getting dominance cones...");

        DominanceCones result = dominanceConesService.getDominanceCones(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DominanceCones> putDominanceCones(
            @PathVariable("id") UUID id) {
        logger.info("Putting dominance cones...");

        DominanceCones result = dominanceConesService.putDominanceCones(id);

        return ResponseEntity.ok(result);
    }
}
