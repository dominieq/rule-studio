package pl.put.poznan.rulework.service;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.csv.ObjectParser;
import org.rulelearn.data.json.AttributeParser;
import org.rulelearn.rules.*;
import org.rulelearn.rules.ruleml.RuleParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.exception.ProjectNotFoundException;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;

@Service
public class ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private Project getProjectFromProjectsContainer(UUID id) {
        Project project = projectsContainer.getProjectHashMap().get(id);
        if(project == null) {
            ProjectNotFoundException ex = new ProjectNotFoundException(id);
            logger.error(ex.getMessage());
            throw ex;
        }

        return project;
    }

    public Project getProject(UUID id) {
        logger.info("Id:\t" + id);

        return getProjectFromProjectsContainer(id);
    }

    public Project getProjectWithImposePreferenceOrder(UUID id, Boolean imposePreferenceOrder) {
        logger.info("Id:\t" + id);
        logger.info("ImposePreferenceOrder:\t" + imposePreferenceOrder);
        Project p = getProjectFromProjectsContainer(id);
        p.setInformationTable(p.getInformationTable().imposePreferenceOrders(imposePreferenceOrder));
        return p;
    }

    private RuleSetWithComputableCharacteristics parseComputableRules(MultipartFile rulesFile, Attribute[] attributes) throws IOException {
        Map<Integer, RuleSetWithCharacteristics> parsedRules = null;
        RuleParser ruleParser = new RuleParser(attributes);
        parsedRules = ruleParser.parseRulesWithCharacteristics(rulesFile.getInputStream());

        for(RuleSetWithCharacteristics rswc : parsedRules.values()) {
            logger.info("ruleSet.size=" + rswc.size());
            for(int i = 0; i < rswc.size(); i++) {
                RuleCharacteristics ruleCharacteristics = rswc.getRuleCharacteristics(i);
                logger.info(i + ":\t" + ruleCharacteristics.toString());
            }
        }

        Map.Entry<Integer, RuleSetWithCharacteristics> entry = parsedRules.entrySet().iterator().next();
        RuleSetWithCharacteristics ruleSetWithCharacteristics = entry.getValue();

        Rule[] rules = new Rule[ruleSetWithCharacteristics.size()];
        for(int i = 0; i < ruleSetWithCharacteristics.size(); i++) {
            rules[i] = ruleSetWithCharacteristics.getRule(i);
        }

        RuleCoverageInformation[] ruleCoverageInformation = new RuleCoverageInformation[ruleSetWithCharacteristics.size()];
        for(int i = 0; i < ruleSetWithCharacteristics.size(); i++) {
            ruleCoverageInformation[i] = new RuleCoverageInformation(null, null, null, null, 0);
        }

        return new RuleSetWithComputableCharacteristics(
                rules,
                ruleCoverageInformation
        );
    }

    private RuleSetWithCharacteristics parseRules(MultipartFile rulesFile, Attribute[] attributes) throws IOException {
        Map<Integer, RuleSetWithCharacteristics> parsedRules = null;
        RuleParser ruleParser = new RuleParser(attributes);
        parsedRules = ruleParser.parseRulesWithCharacteristics(rulesFile.getInputStream());

        for(RuleSetWithCharacteristics rswc : parsedRules.values()) {
            logger.info("ruleSet.size=" + rswc.size());
            for(int i = 0; i < rswc.size(); i++) {
                RuleCharacteristics ruleCharacteristics = rswc.getRuleCharacteristics(i);
                logger.info(i + ":\t" + ruleCharacteristics.toString());
            }
        }

        Map.Entry<Integer, RuleSetWithCharacteristics> entry = parsedRules.entrySet().iterator().next();
        RuleSetWithCharacteristics ruleSetWithCharacteristics = entry.getValue();

        return ruleSetWithCharacteristics;
    }

    public Project setProject(UUID id, MultipartFile metadataFile, MultipartFile dataFile, MultipartFile rulesFile) throws IOException {
        logger.info("Id:\t" + id);
        if(metadataFile != null)    logger.info("Metadata:\t" + metadataFile.getOriginalFilename() + "\t" + metadataFile.getContentType());
        if(dataFile != null)        logger.info("Data:\t" + dataFile.getOriginalFilename() + "\t" + dataFile.getContentType());
        if(rulesFile != null)       logger.info("Rules:\t" + rulesFile.getOriginalFilename() + "\t" + rulesFile.getContentType());

        Project project = getProjectFromProjectsContainer(id);

        if((metadataFile == null) && (dataFile == null) && (rulesFile == null)) {
            project.setInformationTable(new InformationTable(new Attribute[0], new ArrayList<>()));
            project.setRuleSetWithComputableCharacteristics(null);

            return project;
        }

        Reader reader;
        Attribute[] attributes;
        InformationTable informationTable = project.getInformationTable();

        if(metadataFile != null) { //load new metadata from file
            AttributeParser attributeParser = new AttributeParser();
            reader = new InputStreamReader(metadataFile.getInputStream());
            attributes = attributeParser.parseAttributes(reader);
            for(int i = 0; i < attributes.length; i++) {
                logger.debug("{}:\t{}", i, attributes[i]);
            }

            informationTable = new InformationTable(attributes, new ArrayList<>());
            project.setRuleSetWithComputableCharacteristics(null);
        }

        if(dataFile != null) { //load new data from file
            attributes = informationTable.getAttributes();

            if (dataFile.getContentType().equals("application/json")) {
                logger.info("Data type is json");
                org.rulelearn.data.json.ObjectParser objectParser = new org.rulelearn.data.json.ObjectParser.Builder(attributes).build();
                reader = new InputStreamReader(dataFile.getInputStream());
                informationTable = objectParser.parseObjects(reader);

            } else if (dataFile.getContentType().equals("application/vnd.ms-excel")) {
                logger.info("Data type is csv");
                ObjectParser objectParser = new ObjectParser.Builder(attributes).build();
                reader = new InputStreamReader(dataFile.getInputStream());
                informationTable = objectParser.parseObjects(reader);

            } else {
                logger.error("Unrecognized format of data file: " + dataFile.getContentType());
            }
        }

        if((metadataFile != null) || (dataFile != null)) { //don't use setter, when only rulesFile is provided - informationTable doesn't change
            project.setInformationTable(informationTable);
        }


        if(rulesFile != null) { //load rules from file
            attributes = informationTable.getAttributes();
            RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = parseComputableRules(rulesFile, attributes);
            project.setRuleSetWithComputableCharacteristics(ruleSetWithComputableCharacteristics);
        }

        return project;
    }

    public Project renameProject(UUID id, String name) {
        logger.info("Id:\t" + id);
        logger.info("Name:\t" + name);

        Project project = getProjectFromProjectsContainer(id);

        project.setName(name);

        return project;
    }

    public void deleteProject(UUID id) {
        logger.info("Id:\t" + id);

        Project project = projectsContainer.getProjectHashMap().remove(id);

        if(project == null) {
            ProjectNotFoundException ex = new ProjectNotFoundException(id);
            logger.error(ex.getMessage());
            throw ex;
        }
    }
}
