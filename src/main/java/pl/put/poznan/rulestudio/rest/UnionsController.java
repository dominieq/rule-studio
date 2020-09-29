package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.enums.ClassUnionArrayPropertyType;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.service.UnionsService;

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
    public ResponseEntity<MainClassUnionsResponse> getUnions(
            @PathVariable("id") UUID id) {
        logger.info("Getting unions with single limiting decision...");

        final MainClassUnionsResponse result = unionsService.getUnions(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainClassUnionsResponse> putUnions(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold) {
        logger.info("Putting unions with single limiting decision...");

        final MainClassUnionsResponse result = unionsService.putUnions(id, typeOfUnions, consistencyThreshold);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainClassUnionsResponse> postUnions(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting unions with single limiting decision...");

        final MainClassUnionsResponse result = unionsService.postUnions(id, typeOfUnions, consistencyThreshold, metadata, data);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{classUnionIndex}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChosenClassUnionResponse> getChosenClassUnion(
            @PathVariable("id") UUID id,
            @PathVariable("classUnionIndex") Integer classUnionIndex) {
        logger.info("Getting chosen unions with single limiting decision...");

        final ChosenClassUnionResponse result = unionsService.getChosenClassUnion(id, classUnionIndex);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{classUnionIndex}/{classUnionArrayPropertyType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClassUnionArrayPropertyResponse> getClassUnionArrayProperty(
            @PathVariable("id") UUID id,
            @PathVariable("classUnionIndex") Integer classUnionIndex,
            @PathVariable("classUnionArrayPropertyType") ClassUnionArrayPropertyType classUnionArrayPropertyType) {
        logger.info("Getting class union's array property...");

        final ClassUnionArrayPropertyResponse result = unionsService.getClassUnionArrayProperty(id, classUnionIndex, classUnionArrayPropertyType);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/object", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObjectAbstractResponse> getObject(
            @PathVariable("id") UUID id,
            @RequestParam("objectIndex") Integer objectIndex,
            @RequestParam(name = "isAttributes", defaultValue = "false") Boolean isAttributes) throws IOException {
        logger.info("Getting object from class unions...");

        final ObjectAbstractResponse result = unionsService.getObject(id, objectIndex, isAttributes);

        return ResponseEntity.ok(result);
    }
}
