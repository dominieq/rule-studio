package pl.put.poznan.rulestudio.model;

public class ValidityProjectContainer extends ValidityRulesContainer {
    private Boolean dominanceCones;
    private Boolean rulesExternal;
    private Boolean rulesData;
    private Boolean crossValidation;

    public ValidityProjectContainer(Project project) {
        super(project);

        DominanceCones dominanceCones = project.getDominanceCones();
        if(dominanceCones != null) {
            this.dominanceCones = project.getDominanceCones().isCurrentData();
        }

        RulesWithHttpParameters rules = project.getRules();
        if(rules != null) {
            this.rulesExternal = project.getRules().isExternalRules();
            this.rulesData = project.getRules().isCurrentData();
        }

        CrossValidation crossValidation = project.getCrossValidation();
        if(crossValidation != null) {
            this.crossValidation = project.getCrossValidation().isCurrentData();
        }
    }

    public Boolean getDominanceCones() {
        return dominanceCones;
    }

    public void setDominanceCones(Boolean dominanceCones) {
        this.dominanceCones = dominanceCones;
    }

    public Boolean getRulesExternal() {
        return rulesExternal;
    }

    public void setRulesExternal(Boolean rulesExternal) {
        this.rulesExternal = rulesExternal;
    }

    public Boolean getRulesData() {
        return rulesData;
    }

    public void setRulesData(Boolean rulesData) {
        this.rulesData = rulesData;
    }

    public Boolean getCrossValidation() {
        return crossValidation;
    }

    public void setCrossValidation(Boolean crossValidation) {
        this.crossValidation = crossValidation;
    }

    @Override
    public String toString() {
        return "ValidityProjectContainer{" +
                "dominanceCones=" + dominanceCones +
                ", rulesExternal=" + rulesExternal +
                ", rulesData=" + rulesData +
                ", crossValidation=" + crossValidation +
                "} " + super.toString();
    }
}
