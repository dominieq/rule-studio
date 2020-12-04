package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.model.response.InformationTableResponse;
import pl.put.poznan.rulestudio.service.ImposePreferenceOrderService;

import java.io.IOException;
import java.util.UUID;

@CrossOrigin
@RequestMapping("projects/{id}/imposePreferenceOrder")
@RestController
public class ImposePreferenceOrderController {

    private static final Logger logger = LoggerFactory.getLogger(ImposePreferenceOrderController.class);

    private final ImposePreferenceOrderService imposePreferenceOrderService;

    @Autowired
    public ImposePreferenceOrderController(ImposePreferenceOrderService imposePreferenceOrderService) {
        this.imposePreferenceOrderService = imposePreferenceOrderService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InformationTableResponse> getImposePreferenceOrder(
            @PathVariable("id") UUID id,
            @RequestParam(name = "binarizeNominalAttributesWith3PlusValues") Boolean binarizeNominalAttributesWith3PlusValues) throws IOException {
        logger.info("Getting impose preference order...");

        final InformationTableResponse result = imposePreferenceOrderService.getImposePreferenceOrder(id, binarizeNominalAttributesWith3PlusValues);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InformationTableResponse> postImposePreferenceOrder(
            @PathVariable("id") UUID id,
            @RequestParam(name = "binarizeNominalAttributesWith3PlusValues") Boolean binarizeNominalAttributesWith3PlusValues,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting impose preference order...");

        final InformationTableResponse result = imposePreferenceOrderService.postImposePreferenceOrder(id, binarizeNominalAttributesWith3PlusValues, metadata, data);

        return ResponseEntity.ok(result);
    }
}
