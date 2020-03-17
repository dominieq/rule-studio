package pl.put.poznan.rulework.rest;

import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulework.service.ImposePreferenceOrderService;

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
    public ResponseEntity<InformationTable> getImposePreferenceOrder(
            @PathVariable("id") UUID id,
            @RequestParam(name = "binarizeNominalAttributesWith3PlusValues") Boolean binarizeNominalAttributesWith3PlusValues) {
        logger.info("Getting impose preference order...");

        InformationTable result = imposePreferenceOrderService.getImposePreferenceOrder(id, binarizeNominalAttributesWith3PlusValues);

        return ResponseEntity.ok(result);
    }
}
