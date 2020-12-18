package pl.put.poznan.rulestudio.model;

import org.rulelearn.data.InformationTable;
import pl.put.poznan.rulestudio.service.RulesService;

import java.util.ArrayList;
import java.util.UUID;

public class Project {
    private UUID id;
    private String name;
    private InformationTable informationTable;
    private DescriptiveAttributes descriptiveAttributes;
    private DominanceCones dominanceCones;
    private ProjectClassUnions projectClassUnions;
    private RulesWithHttpParameters rules;
    private ProjectClassification projectClassification;
    private CrossValidation crossValidation;
    private String metadataFileName;
    private String dataFileName;

    private boolean currentDominanceCones;
    private boolean currentUnionsWithSingleLimitingDecision;
    private boolean currentRules;

    public Project(String name) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.informationTable = null;
        this.descriptiveAttributes = new DescriptiveAttributes();
        this.currentDominanceCones = false;
        this.currentUnionsWithSingleLimitingDecision = false;
        this.currentRules = false;
    }

    public Project(String name, InformationTable informationTable) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.informationTable = informationTable;
        this.descriptiveAttributes = new DescriptiveAttributes(informationTable);
        this.currentDominanceCones = false;
        this.currentUnionsWithSingleLimitingDecision = false;
        this.currentRules = false;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public InformationTable getInformationTable() {
        return informationTable;
    }

    public void setInformationTable(InformationTable informationTable) {
        this.informationTable = informationTable;
        this.setCurrentDominanceCones(false);
        this.setCurrentUnionsWithSingleLimitingDecision(false);
        this.setCurrentRules(false);

        String dataHash = informationTable.getHash();
        if(this.dominanceCones != null) {
            if (dominanceCones.getDataHash().equals(dataHash)) {
                dominanceCones.setCurrentData(true);
            } else {
                dominanceCones.setCurrentData(false);
            }
        }
        if(this.projectClassUnions != null) {
            if (projectClassUnions.getDataHash().equals(dataHash)) {
                projectClassUnions.setCurrentData(true);
            } else {
                projectClassUnions.setCurrentData(false);
            }
        }
        if(this.rules != null) {
            if (rules.isExternalRules()) {
                final String attributesHash = new InformationTable(informationTable.getAttributes(), new ArrayList<>()).getHash();
                if (rules.getAttributesHash().equals(attributesHash)) {
                    rules.setCurrentAttributes(true);
                } else {
                    rules.setCurrentAttributes(false);
                }
            }

            if (rules.getRuleSet().getLearningInformationTableHash() == null) {
                rules.setCurrentLearningData(null);
            } else if (rules.getRuleSet().getLearningInformationTableHash().equals(dataHash)) {
                rules.setCurrentLearningData(true);
            } else {
                rules.setCurrentLearningData(false);
            }
        }
        if(this.projectClassification != null) {
            if (projectClassification.isExternalData()) {
                final String attributesHash = new InformationTable(informationTable.getAttributes(), new ArrayList<>()).getHash();
                if(projectClassification.getAttributesHash().equals(attributesHash)) {
                    projectClassification.setCurrentProjectData(true);
                } else {
                    projectClassification.setCurrentProjectData(false);
                }
            } else {
                if(projectClassification.getProjectDataHash().equals(dataHash)) {
                    projectClassification.setCurrentProjectData(true);
                } else {
                    projectClassification.setCurrentProjectData(false);
                }
            }

            if ((projectClassification.isCurrentLearningData() != null) && (projectClassification.getLearningInformationTable().getHash().equals(dataHash))) {
                projectClassification.setCurrentLearningData(true);
            } else {
                projectClassification.setCurrentLearningData(false);
            }
        }
        if(this.crossValidation != null) {
            if (crossValidation.getDataHash().equals(dataHash)) {
                crossValidation.setCurrentData(true);
            } else {
                crossValidation.setCurrentData(false);
            }
        }

        String previousName = this.descriptiveAttributes.getCurrentAttributeName();
        this.descriptiveAttributes = new DescriptiveAttributes(informationTable, previousName);
    }

    public DescriptiveAttributes getDescriptiveAttributes() {
        return descriptiveAttributes;
    }

    public void setDescriptiveAttributes(DescriptiveAttributes descriptiveAttributes) {
        this.descriptiveAttributes = descriptiveAttributes;
    }

    public DominanceCones getDominanceCones() {
        return dominanceCones;
    }

    public void setDominanceCones(DominanceCones dominanceCones) {
        this.dominanceCones = dominanceCones;
    }

    public ProjectClassUnions getProjectClassUnions() {
        return projectClassUnions;
    }

    public void setProjectClassUnions(ProjectClassUnions projectClassUnions) {
        this.projectClassUnions = projectClassUnions;
    }

    public boolean isCurrentDominanceCones() {
        return currentDominanceCones;
    }

    public void setCurrentDominanceCones(boolean currentDominanceCones) {
        this.currentDominanceCones = currentDominanceCones;
    }

    public boolean isCurrentUnionsWithSingleLimitingDecision() {
        return currentUnionsWithSingleLimitingDecision;
    }

    public void setCurrentUnionsWithSingleLimitingDecision(boolean currentUnionsWithSingleLimitingDecision) {
        this.currentUnionsWithSingleLimitingDecision = currentUnionsWithSingleLimitingDecision;
    }

    public boolean isCurrentRules() {
        return currentRules;
    }

    public void setCurrentRules(boolean currentRules) {
        this.currentRules = currentRules;
    }

    public RulesWithHttpParameters getRules() {
        return rules;
    }

    public void setRules(RulesWithHttpParameters rules) {
        this.rules = rules;

        if (this.rules == null) {
            if(this.projectClassification != null) {
                this.projectClassification.setCurrentRuleSet(null);
            }
            return;
        }

        if (this.rules.isExternalRules()) {
            RulesService.checkCoverageOfUploadedRules(this.rules, this.informationTable, this.descriptiveAttributes);
        }

        if (this.projectClassification != null) {
            if (this.projectClassification.getRuleSet().getHash().equals(this.rules.getRuleSet().getHash())) {
                this.projectClassification.setCurrentRuleSet(true);
            } else {
                this.projectClassification.setCurrentRuleSet(false);
            }
        }

        ValidityRulesContainer validityRulesContainer = new ValidityRulesContainer(this);
        this.rules.setValidityRulesContainer(validityRulesContainer);
    }

    public ProjectClassification getProjectClassification() {
        return projectClassification;
    }

    public void setProjectClassification(ProjectClassification projectClassification) {
        this.projectClassification = projectClassification;
    }

    public CrossValidation getCrossValidation() {
        return crossValidation;
    }

    public void setCrossValidation(CrossValidation crossValidation) {
        this.crossValidation = crossValidation;
    }

    public String getMetadataFileName() {
        return metadataFileName;
    }

    public void setMetadataFileName(String metadataFileName) {
        this.metadataFileName = metadataFileName;
    }

    public String getDataFileName() {
        return dataFileName;
    }

    public void setDataFileName(String dataFileName) {
        this.dataFileName = dataFileName;
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", informationTable=" + informationTable +
                ", descriptiveAttributes=" + descriptiveAttributes +
                ", dominanceCones=" + dominanceCones +
                ", projectClassUnions=" + projectClassUnions +
                ", rules=" + rules +
                ", projectClassification=" + projectClassification +
                ", crossValidation=" + crossValidation +
                ", metadataFileName='" + metadataFileName + '\'' +
                ", dataFileName='" + dataFileName + '\'' +
                ", currentDominanceCones=" + currentDominanceCones +
                ", currentUnionsWithSingleLimitingDecision=" + currentUnionsWithSingleLimitingDecision +
                ", currentRules=" + currentRules +
                '}';
    }
}
