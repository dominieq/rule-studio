package pl.put.poznan.rulestudio.model.parameters;

import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;

public class RulesParametersImpl extends ClassUnionsParametersImpl implements RulesParameters {

    private RuleType typeOfRules;

    private RulesParametersImpl(UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules) {
        super(typeOfUnions, consistencyThreshold);
        this.typeOfRules = typeOfRules;
    }

    public static RulesParametersImpl getInstance(UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules) {
        if(typeOfUnions == null) {
            return null;
        }

        return new RulesParametersImpl(typeOfUnions, consistencyThreshold, typeOfRules);
    }

    @Override
    public RuleType getTypeOfRules() {
        return typeOfRules;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RulesParametersImpl)) return false;
        if (!super.equals(o)) return false;
        RulesParametersImpl that = (RulesParametersImpl) o;
        return getTypeOfRules() == that.getTypeOfRules();
    }

    @Override
    public String toString() {
        return "RulesParametersImpl{" +
                "typeOfRules=" + typeOfRules +
                "} " + super.toString();
    }
}
