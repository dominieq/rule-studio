package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.enums.ClassUnionArrayPropertyType;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.model.parameters.ClassUnionsParameters;
import pl.put.poznan.rulestudio.model.parameters.ClassUnionsParametersImpl;
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
        logger.info("[START] Getting unions with single limiting decision...");

        final MainClassUnionsResponse result = unionsService.getUnions(id);

        logger.info("[ END ] Getting unions with single limiting decision is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainClassUnionsResponse> putUnions(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold) {
        logger.info("[START] Putting unions with single limiting decision...");

        final ClassUnionsParameters classUnionsParameters = new ClassUnionsParametersImpl(typeOfUnions, consistencyThreshold);
        final MainClassUnionsResponse result = unionsService.putUnions(id, classUnionsParameters);

        logger.info("[ END ] Putting unions with single limiting decision is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MainClassUnionsResponse> postUnions(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("[START] Posting unions with single limiting decision...");

        final ClassUnionsParameters classUnionsParameters = new ClassUnionsParametersImpl(typeOfUnions, consistencyThreshold);
        final MainClassUnionsResponse result = unionsService.postUnions(id, classUnionsParameters, metadata, data);

        logger.info("[ END ] Posting unions with single limiting decision is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> getDescriptiveAttributes(
            @PathVariable("id") UUID id) {
        logger.info("[START] Getting descriptive attributes in class unions...");

        final DescriptiveAttributesResponse result = unionsService.getDescriptiveAttributes(id);

        logger.info("[ END ] Getting descriptive attributes in class unions is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/descriptiveAttributes", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DescriptiveAttributesResponse> postDescriptiveAttributes(
            @PathVariable("id") UUID id,
            @RequestParam(name = "objectVisibleName", required = false) String objectVisibleName) {
        logger.info("[START] Posting descriptive attributes in class unions...");

        final DescriptiveAttributesResponse result = unionsService.postDescriptiveAttributes(id, objectVisibleName);

        logger.info("[ END ] Posting descriptive attributes in class unions is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/objectNames", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AttributeFieldsResponse> getObjectNames(
            @PathVariable("id") UUID id,
            @RequestParam(name = "subject", required = false) Integer classUnionIndex,
            @RequestParam(name = "set", required = false) ClassUnionArrayPropertyType classUnionArrayPropertyType) {
        logger.info("[START] Getting object names in class unions...");

        AttributeFieldsResponse result;
        if((classUnionIndex != null) && (classUnionArrayPropertyType != null)) {
            result = unionsService.getObjectNames(id, classUnionIndex, classUnionArrayPropertyType);
        } else {
            result = unionsService.getObjectNames(id);
        }

        logger.info("[ END ] Getting object names in class unions is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{classUnionIndex}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChosenClassUnionResponse> getChosenClassUnion(
            @PathVariable("id") UUID id,
            @PathVariable("classUnionIndex") Integer classUnionIndex) {
        logger.info("[START] Getting chosen unions with single limiting decision...");

        final ChosenClassUnionResponse result = unionsService.getChosenClassUnion(id, classUnionIndex);

        logger.info("[ END ] Getting chosen unions with single limiting decision is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/{classUnionIndex}/{classUnionArrayPropertyType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClassUnionArrayPropertyResponse> getClassUnionArrayProperty(
            @PathVariable("id") UUID id,
            @PathVariable("classUnionIndex") Integer classUnionIndex,
            @PathVariable("classUnionArrayPropertyType") ClassUnionArrayPropertyType classUnionArrayPropertyType) {
        logger.info("[START] Getting class union's array property...");

        final ClassUnionArrayPropertyResponse result = unionsService.getClassUnionArrayProperty(id, classUnionIndex, classUnionArrayPropertyType);

        logger.info("[ END ] Getting class union's array property is done.");
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/object", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObjectAbstractResponse> getObject(
            @PathVariable("id") UUID id,
            @RequestParam("objectIndex") Integer objectIndex,
            @RequestParam(name = "isAttributes", defaultValue = "false") Boolean isAttributes) throws IOException {
        logger.info("[START] Getting object from class unions...");

        final ObjectAbstractResponse result = unionsService.getObject(id, objectIndex, isAttributes);

        logger.info("[ END ] Getting object from class unions is done.");
        return ResponseEntity.ok(result);
    }
}
