package pl.put.poznan.rulestudio.model;

public class ValidityProjectContainer extends ValidityRulesContainer {
    private Boolean dominanceCones;
    private Boolean crossValidation;

    public ValidityProjectContainer(Project project) {
        super(project);

        DominanceCones dominanceCones = project.getDominanceCones();
        if(dominanceCones != null) {
            this.dominanceCones = project.getDominanceCones().isCurrentData();
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
                ", crossValidation=" + crossValidation +
                "} " + super.toString();
    }
}
