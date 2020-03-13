package pl.put.poznan.rulework.service;

import com.sun.org.apache.xpath.internal.operations.Bool;
import it.unimi.dsi.fastutil.ints.Int2ObjectArrayMap;
import it.unimi.dsi.fastutil.ints.IntArrayList;
import it.unimi.dsi.fastutil.ints.IntArraySet;
import org.rulelearn.data.Attribute;
import org.rulelearn.data.EvaluationAttribute;
import org.rulelearn.data.InformationTable;
import org.rulelearn.data.Table;
import org.rulelearn.data.csv.ObjectParser;
import org.rulelearn.data.json.AttributeParser;
import org.rulelearn.rules.*;
import org.rulelearn.rules.ruleml.RuleParser;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.put.poznan.rulework.model.Project;
import pl.put.poznan.rulework.model.ProjectsContainer;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Map;

@Service
public class ProjectsService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectsService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    private void addProjectToProjectsContainer(Project project) {
        projectsContainer.getProjectHashMap().put(project.getId(), project);
    }

    public ArrayList<Project> getProjects() {
        return new ArrayList<Project>(projectsContainer.getProjectHashMap().values());
    }

    private Project createEmptyProject(String name) {
        Project project = new Project(name);
        addProjectToProjectsContainer(project);
        return project;
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
            ruleCoverageInformation[i] = new RuleCoverageInformation(new IntArraySet(), new IntArraySet(), new IntArrayList(), new Int2ObjectArrayMap<>(), 0);
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

    public Project createProject(
            String name,
            MultipartFile metadataFile,
            MultipartFile dataFile,
            MultipartFile rulesFile,
            Character separator,
            Boolean header) throws IOException {
        logger.info("Name:\t{}", name);
        if(metadataFile != null)    logger.info("Metadata:\t{}\t{}", metadataFile.getOriginalFilename(), metadataFile.getContentType());
        if(dataFile != null)        logger.info("Data:\t{}\t{}", dataFile.getOriginalFilename(), dataFile.getContentType());
        if(rulesFile != null)       logger.info("Rules:\t{}\t{}", rulesFile.getOriginalFilename(), rulesFile.getContentType());
        logger.info("Separator:\t{}", separator);
        logger.info("Header:\t{}", header);

        if(metadataFile == null) {
            return createEmptyProject(name);
        }

        Attribute[] attributes;
        InformationTable informationTable = null;
        Project project;

        AttributeParser attributeParser = new AttributeParser();
        Reader reader = new InputStreamReader(metadataFile.getInputStream());
        attributes = attributeParser.parseAttributes(reader);
        for(int i = 0; i < attributes.length; i++) {
            logger.debug(i + ":\t" + attributes[i]);
        }

        if(dataFile != null) { //load data from file
            informationTable = DataService.readDataFile(dataFile, attributes, separator, header);
        } else { //there is no objects
            informationTable = new InformationTable(attributes, new ArrayList<>());
        }

        project = new Project(name, informationTable);


        if(rulesFile != null) { //load rules from file
            RuleSetWithComputableCharacteristics ruleSetWithComputableCharacteristics = parseComputableRules(rulesFile, attributes);
            project.setRuleSetWithComputableCharacteristics(ruleSetWithComputableCharacteristics);
        }


        projectsContainer.getProjectHashMap().put(project.getId(), project);
        logger.info(project.toString());
        return project;
    }
}
