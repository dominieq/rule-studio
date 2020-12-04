package pl.put.poznan.rulestudio.service;

import org.rulelearn.data.InformationTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.model.Project;
import pl.put.poznan.rulestudio.model.ProjectsContainer;
import pl.put.poznan.rulestudio.model.response.InformationTableResponse;

import java.io.IOException;
import java.util.UUID;

@Service
public class ImposePreferenceOrderService {

    private static final Logger logger = LoggerFactory.getLogger(ImposePreferenceOrderService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public InformationTableResponse getImposePreferenceOrder(UUID id, Boolean binarizeNominalAttributesWith3PlusValues) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("BinarizeNominalAttributesWith3PlusValues:\t" + binarizeNominalAttributesWith3PlusValues);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();
        DataService.checkInformationTable(informationTable, "There is no data in project. Couldn't perform operation.");

        informationTable = informationTable.imposePreferenceOrders(binarizeNominalAttributesWith3PlusValues);

        final InformationTableResponse informationTableResponse = new InformationTableResponse(informationTable);
        logger.debug(informationTableResponse.toString());
        return informationTableResponse;
    }

    public InformationTableResponse postImposePreferenceOrder(UUID id, Boolean binarizeNominalAttributesWith3PlusValues, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("BinarizeNominalAttributesWith3PlusValues:\t{}", binarizeNominalAttributesWith3PlusValues);
        logger.info("Metadata size:\t{} B", metadata.length());
        logger.debug("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);

        ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final InformationTable informationTable = ProjectService
                .createInformationTableFromString(metadata, data)
                .imposePreferenceOrders(binarizeNominalAttributesWith3PlusValues);

        final InformationTableResponse informationTableResponse = new InformationTableResponse(informationTable);
        logger.debug(informationTableResponse.toString());
        return informationTableResponse;
    }
}
