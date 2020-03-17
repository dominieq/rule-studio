package pl.put.poznan.rulework.service;

import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulework.exception.EmptyResponseException;
import pl.put.poznan.rulework.model.DominanceCones;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.IOException;
import java.util.UUID;

@Service
public class ImposePreferenceOrderService {

    private static final Logger logger = LoggerFactory.getLogger(ImposePreferenceOrderService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public InformationTable getImposePreferenceOrder(UUID id, Boolean binarizeNominalAttributesWith3PlusValues) {
        logger.info("Id:\t{}", id);
        logger.info("BinarizeNominalAttributesWith3PlusValues:\t" + binarizeNominalAttributesWith3PlusValues);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable().imposePreferenceOrders(binarizeNominalAttributesWith3PlusValues);

        logger.debug("InformationTable:\t{}", informationTable);
        return informationTable;
    }

    public InformationTable postImposePreferenceOrder(UUID id, Boolean binarizeNominalAttributesWith3PlusValues, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("BinarizeNominalAttributesWith3PlusValues:\t{}", binarizeNominalAttributesWith3PlusValues);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data:\t{}", data);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService
                .createInformationTableFromString(metadata, data)
                .imposePreferenceOrders(binarizeNominalAttributesWith3PlusValues);

        logger.debug("InformationTable:\t{}", informationTable);
        return informationTable;
    }
}
