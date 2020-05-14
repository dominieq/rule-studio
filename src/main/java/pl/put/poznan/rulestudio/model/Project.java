package pl.put.poznan.rulestudio.model;

import org.rulelearn.data.InformationTable;

import java.util.UUID;

public class Project {
    private UUID id;
    private String name;
    private InformationTable informationTable;
    private DominanceCones dominanceCones;
    private UnionsWithHttpParameters unions;
    private RulesWithHttpParameters rules;
    private Classification classification;
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
        this.currentDominanceCones = false;
        this.currentUnionsWithSingleLimitingDecision = false;
        this.currentRules = false;
    }

    public Project(String name, InformationTable informationTable) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.informationTable = informationTable;
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
        if(this.unions != null) {
            if (unions.getDataHash().equals(dataHash)) {
                unions.setCurrentData(true);
            } else {
                unions.setCurrentData(false);
            }
        }
        if(this.rules != null) {
            if(rules.getDataHash() == null) {
                rules.setCurrentData(null);
            } else if (rules.getDataHash().equals(dataHash)) {
                rules.setCurrentData(true);
            } else {
                rules.setCurrentData(false);
            }
        }
        if(this.classification != null) {
            if (classification.getLearningDataHash().equals(dataHash)) {
                classification.setCurrentLearningData(true);
            } else {
                classification.setCurrentLearningData(false);
            }
        }
        if(this.crossValidation != null) {
            if (crossValidation.getDataHash().equals(dataHash)) {
                crossValidation.setCurrentData(true);
            } else {
                crossValidation.setCurrentData(false);
            }
        }
    }

    public DominanceCones getDominanceCones() {
        return dominanceCones;
    }

    public void setDominanceCones(DominanceCones dominanceCones) {
        this.dominanceCones = dominanceCones;
    }

    public UnionsWithHttpParameters getUnions() {
        return unions;
    }

    public void setUnions(UnionsWithHttpParameters unions) {
        this.unions = unions;
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

        if(this.classification != null) {
            if ((this.rules == null) || (this.rules.getDataHash() == null)) {
                classification.setCurrentRuleSet(null);
            } else if (classification.getRuleSetHash().equals(this.rules.getDataHash())) {
                classification.setCurrentRuleSet(true);
            } else {
                classification.setCurrentRuleSet(false);
            }
        }
    }

    public Classification getClassification() {
        return classification;
    }

    public void setClassification(Classification classification) {
        this.classification = classification;
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
                ", dominanceCones=" + dominanceCones +
                ", unions=" + unions +
                ", rules=" + rules +
                ", classification=" + classification +
                ", crossValidation=" + crossValidation +
                ", metadataFileName='" + metadataFileName + '\'' +
                ", dataFileName='" + dataFileName + '\'' +
                ", currentDominanceCones=" + currentDominanceCones +
                ", currentUnionsWithSingleLimitingDecision=" + currentUnionsWithSingleLimitingDecision +
                ", currentRules=" + currentRules +
                '}';
    }
}
