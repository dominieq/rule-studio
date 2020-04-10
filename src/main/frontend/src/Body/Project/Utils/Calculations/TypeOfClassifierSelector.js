import React from "react";
import PropTypes from "prop-types";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import RuleWorkHelper from "../../../../RuleWorkComponents/Feedback/RuleWorkHelper";
import MenuItem from "@material-ui/core/MenuItem";

const classifiers = [
    {
        label: "Simple Rule Classifier (avg)",
        value: "SimpleRuleClassifier"
    },
    {
        label: "Simple Rule Classifier (mode)",
        value: "SimpleOptimizingCountingRuleClassifier"
    },
    {
        label: "Scoring Rule Classifier",
        value: "ScoringRuleClassifierScore",
    },
    {
        label: "Hybrid Scoring Rule Classifier",
        value: "ScoringRuleClassifierHybrid"
    }
];

function TypeOfClassifierSelector(props) {
    const { id } = props;

    return (
        <div id={id} style={{display: "flex", alignItems: "center", margin: "4px 0"}}>
            <RuleWorkHelper style={{marginRight: 16}}>
                {"Add more information to tooltip"}
            </RuleWorkHelper>
            <RuleWorkSmallBox style={{flexGrow: 1, margin: 0}}>
                <RuleWorkTextField
                    outsideLabel={"Select type of classifier"}
                    select={true}
                    {...props}
                >
                    {classifiers.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </RuleWorkTextField>
            </RuleWorkSmallBox>
        </div>
    )
}

TypeOfClassifierSelector.propTypes = {
    disabledChildren: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default TypeOfClassifierSelector;