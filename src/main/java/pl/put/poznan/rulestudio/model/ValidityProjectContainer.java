package pl.put.poznan.rulestudio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ValidityProjectContainer extends ValidityRulesContainer {

    @JsonProperty("dominanceCones")
    private DominanceConesValidity dominanceConesValidity;

    @JsonProperty("rules")
    private RulesValidity rulesValidity;

    @JsonProperty("crossValidation")
    private CrossValidationValidity crossValidationValidity;

    public ValidityProjectContainer(Project project) {
        super(project);

        final DominanceCones dominanceCones = project.getDominanceCones();
        if (dominanceCones != null) {
            this.dominanceConesValidity = new DominanceConesValidity(dominanceCones);
        } else {
            this.dominanceConesValidity = null;
        }

        final RulesWithHttpParameters rules = project.getRules();
        if (rules != null) {
            this.rulesValidity = new RulesValidity(rules);
        } else {
            this.rulesValidity = null;
        }

        final CrossValidation crossValidation = project.getCrossValidation();
        if (crossValidation != null) {
            this.crossValidationValidity = new CrossValidationValidity(crossValidation);
        } else {
            this.crossValidationValidity = null;
        }
    }

    public DominanceConesValidity getDominanceConesValidity() {
        return dominanceConesValidity;
    }

    public RulesValidity getRulesValidity() {
        return rulesValidity;
    }

    public CrossValidationValidity getCrossValidationValidity() {
        return crossValidationValidity;
    }

    @Override
    public String toString() {
        return "ValidityProjectContainer{" +
                "dominanceConesValidity=" + dominanceConesValidity +
                ", rulesValidity=" + rulesValidity +
                ", crossValidationValidity=" + crossValidationValidity +
                "} " + super.toString();
    }

    private class DominanceConesValidity {

        @JsonProperty("isCurrentData")
        private Boolean isCurrentData;

        public DominanceConesValidity(DominanceCones dominanceCones) {
            this.isCurrentData = dominanceCones.isCurrentData();
        }

        @JsonIgnore
        public Boolean getCurrentData() {
            return isCurrentData;
        }

        @Override
        public String toString() {
            return "DominanceConesValidity{" +
                    "isCurrentData=" + isCurrentData +
                    '}';
        }
    }

    private class RulesValidity {

        private Boolean externalRules;

        @JsonProperty("isCurrentData")
        private Boolean isCurrentData;

        public RulesValidity(RulesWithHttpParameters rules) {
            this.externalRules = rules.isExternalRules();
            this.isCurrentData = rules.isCurrentData();
        }

        public Boolean getExternalRules() {
            return externalRules;
        }

        @JsonIgnore
        public Boolean getCurrentData() {
            return isCurrentData;
        }

        @Override
        public String toString() {
            return "RulesValidity{" +
                    "externalRules=" + externalRules +
                    ", isCurrentData=" + isCurrentData +
                    '}';
        }
    }

    private class CrossValidationValidity {

        @JsonProperty("isCurrentData")
        private Boolean isCurrentData;

        public CrossValidationValidity(CrossValidation crossValidation) {
            this.isCurrentData = crossValidation.isCurrentData();
        }

        @JsonIgnore
        public Boolean getCurrentData() {
            return isCurrentData;
        }

        @Override
        public String toString() {
            return "CrossValidationValidity{" +
                    "isCurrentData=" + isCurrentData +
                    '}';
        }
    }
}
