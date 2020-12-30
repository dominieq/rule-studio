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
        logger.info("[START] Getting dominance cones...");

        final MainDominanceConesResponse result = dominanceConesService.getDominanceCones(id);

        logger.info("[ END ] Getting dominance cones is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainDominanceConesResponse> putDominanceCones(
            @PathVariable("id") UUID id) {
        logger.info("[START] Putting dominance cones...");

        final MainDominanceConesResponse result = dominanceConesService.putDominanceCones(id);

        logger.info("[ END ] Putting dominance cones is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainDominanceConesResponse> postDominanceCones(
            @PathVariable("id") UUID id,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("[START] Posting dominance cones...");

        final MainDominanceConesResponse result = dominanceConesService.postDominanceCones(id, metadata, data);

        logger.info("[ END ] Posting dominance cones is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> getDescriptiveAttributes(
            @PathVariable("id") UUID id) {
        logger.info("[START] Getting descriptive attributes in dominance cones...");

        final DescriptiveAttributesResponse result = dominanceConesService.getDescriptiveAttributes(id);

        logger.info("[ END ] Getting descriptive attributes in dominance cones is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> postDescriptiveAttributes(
            @PathVariable("id") UUID id,
            @RequestParam(name = "objectVisibleName", required = false) String objectVisibleName) {
        logger.info("[START] Posting descriptive attributes in dominance cones...");

        final DescriptiveAttributesResponse result = dominanceConesService.postDescriptiveAttributes(id, objectVisibleName);

        logger.info("[ END ] Posting descriptive attributes in dominance cones is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/objectNames", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AttributeFieldsResponse> getObjectNames(
            @PathVariable("id") UUID id) {
        logger.info("[START] Getting object names in dominance cones...");

        final AttributeFieldsResponse result = dominanceConesService.getObjectNames(id);

        logger.info("[ END ] Getting object names in dominance cones is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{objectIndex}/{coneType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChosenDominanceConeResponse> getChosenDominanceCone(
            @PathVariable("id") UUID id,
            @PathVariable("objectIndex") Integer objectIndex,
            @PathVariable("coneType") ConeType coneType) {
        logger.info("[START] Getting chosen cone...");

        final ChosenDominanceConeResponse result = dominanceConesService.getChosenDominanceCone(id, objectIndex, coneType);

        logger.info("[ END ] Getting chosen cone is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/object", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObjectAbstractResponse> getObject(
            @PathVariable("id") UUID id,
            @RequestParam("objectIndex") Integer objectIndex,
            @RequestParam(name = "isAttributes", defaultValue = "false") Boolean isAttributes) throws IOException {
        logger.info("[START] Getting object from dominance cones...");

        final ObjectAbstractResponse result = dominanceConesService.getObject(id, objectIndex, isAttributes);

        logger.info("[ END ] Getting object from dominance cones is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/objectsComparison", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObjectsComparisonResponse> getObjectsComparison(
            @PathVariable("id") UUID id,
            @RequestParam("firstObjectIndex") Integer firstObjectIndex,
            @RequestParam("secondObjectIndex") Integer secondObjectIndex) {
        logger.info("[START] Getting objects' comparison from dominance cones...");

        final ObjectsComparisonResponse result = dominanceConesService.getObjectsComparison(id, firstObjectIndex, secondObjectIndex);

        logger.info("[ END ] Getting objects' comparison from dominance cones is done.");
        return ResponseEntity.ok(result);
    }
}
