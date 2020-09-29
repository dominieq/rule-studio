package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.enums.ConeType;
import pl.put.poznan.rulestudio.model.response.*;
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

        final MainDominanceConesResponse result = dominanceConesService.getDominanceCones(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainDominanceConesResponse> putDominanceCones(
            @PathVariable("id") UUID id) {
        logger.info("Putting dominance cones...");

        final MainDominanceConesResponse result = dominanceConesService.putDominanceCones(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainDominanceConesResponse> postDominanceCones(
            @PathVariable("id") UUID id,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting dominance cones...");

        final MainDominanceConesResponse result = dominanceConesService.postDominanceCones(id, metadata, data);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{objectIndex}/{coneType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChosenDominanceConeResponse> getChosenDominanceCone(
            @PathVariable("id") UUID id,
            @PathVariable("objectIndex") Integer objectIndex,
            @PathVariable("coneType") ConeType coneType) {
        logger.info("Getting chosen cone...");

        final ChosenDominanceConeResponse result = dominanceConesService.getChosenDominanceCone(id, objectIndex, coneType);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/object", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObjectAbstractResponse> getObject(
            @PathVariable("id") UUID id,
            @RequestParam("objectIndex") Integer objectIndex,
            @RequestParam(name = "isAttributes", defaultValue = "false") Boolean isAttributes) throws IOException {
        logger.info("Getting object from dominance cones...");

        final ObjectAbstractResponse result = dominanceConesService.getObject(id, objectIndex, isAttributes);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/objectsComparison", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObjectsComparisonResponse> getObjectsComparison(
            @PathVariable("id") UUID id,
            @RequestParam("firstObjectIndex") Integer firstObjectIndex,
            @RequestParam("secondObjectIndex") Integer secondObjectIndex) {
        logger.info("Getting objects' comparison from dominance cones...");

        final ObjectsComparisonResponse result = dominanceConesService.getObjectsComparison(id, firstObjectIndex, secondObjectIndex);

        return ResponseEntity.ok(result);
    }
}
