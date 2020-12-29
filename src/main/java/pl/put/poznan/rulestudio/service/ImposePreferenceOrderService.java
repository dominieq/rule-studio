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
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("binarizeNominalAttributesWith3PlusValues=").append(binarizeNominalAttributesWith3PlusValues);
            logger.info(sb.toString());
        }

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();
        DataService.checkInformationTable(informationTable, "There is no data in project. Couldn't perform operation.");
        DataService.checkNumberOfObjects(informationTable, "There are no objects in project. Couldn't perform operation.");

        informationTable = informationTable.imposePreferenceOrders(binarizeNominalAttributesWith3PlusValues);

        final InformationTableResponse informationTableResponse = new InformationTableResponse(informationTable);
        logger.debug(informationTableResponse.toString());
        return informationTableResponse;
    }

    public InformationTableResponse postImposePreferenceOrder(UUID id, Boolean binarizeNominalAttributesWith3PlusValues, String metadata, String data) throws IOException {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append(", ");
            sb.append("binarizeNominalAttributesWith3PlusValues=").append(binarizeNominalAttributesWith3PlusValues).append(", ");
            sb.append("metadataSize=").append(metadata.length()).append("B, ");
            if (logger.isDebugEnabled()) sb.append("metadata=").append(metadata).append(", ");
            sb.append("dataSize=").append(data.length()).append('B');
            if (logger.isDebugEnabled()) sb.append(", ").append("data=").append(data);
            logger.info(sb.toString());
        }

        ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        DataService.checkNumberOfObjects(informationTable, "There are no objects in project. Couldn't perform operation.");

        informationTable = informationTable.imposePreferenceOrders(binarizeNominalAttributesWith3PlusValues);

        final InformationTableResponse informationTableResponse = new InformationTableResponse(informationTable);
        logger.debug(informationTableResponse.toString());
        return informationTableResponse;
    }
}
