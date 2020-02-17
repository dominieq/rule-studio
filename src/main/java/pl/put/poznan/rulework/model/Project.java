package pl.put.poznan.rulework.model;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;

import java.util.ArrayList;
import java.util.UUID;

public class Project {
    private UUID id;
    private String name;
    private InformationTable informationTable;
    private DominanceCones dominanceCones;
    private UnionsWithSingleLimitingDecision unions;

    private boolean calculatedDominanceCones;

    public Project(String name) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.informationTable = new InformationTable(new Attribute[0], new ArrayList<>());
        this.calculatedDominanceCones = false;
    }

    public Project(String name, InformationTable informationTable) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.informationTable = informationTable;
        this.calculatedDominanceCones = false;
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
        this.setCalculatedDominanceCones(false);
    }

    public DominanceCones getDominanceCones() {
        if(dominanceCones == null) {
            dominanceCones = new DominanceCones();
        }

        return dominanceCones;
    }

    public void setDominanceCones(DominanceCones dominanceCones) {
        this.dominanceCones = dominanceCones;
    }

    public UnionsWithSingleLimitingDecision getUnionsWithSingleLimitingDecision() {
        return unions;
    }

    public void setUnionsWithSingleLimitingDecision(UnionsWithSingleLimitingDecision unions) {
        this.unions = unions;
    }

    public boolean isCalculatedDominanceCones() {
        return calculatedDominanceCones;
    }

    public void setCalculatedDominanceCones(boolean calculatedDominanceCones) {
        this.calculatedDominanceCones = calculatedDominanceCones;
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", informationTable=" + informationTable +
                ", calculatedDominanceCones=" + calculatedDominanceCones +
                "}";
    }
}
