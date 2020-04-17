import React from "react";
import PropTypes from "prop-types";
import { calculationStyles } from "./styles";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
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
        value: "ScoringRuleClassifierScore"
    },
    {
        label: "Hybrid Scoring Rule Classifier",
        value: "ScoringRuleClassifierHybrid"
    }
];

function TypeOfClassifierSelector(props) {
    const { CircleHelperProps, id, TextFieldProps, ...other } = props;
    const calculationClasses = calculationStyles();

    return (
        <div id={id} className={calculationClasses.drawerRow}>
            <CircleHelper
                title={"Add more information to tooltip"}
                WrapperProps={{
                    style: {marginRight: 16}
                }}
                {...CircleHelperProps}
            />
            <RuleWorkSmallBox className={calculationClasses.inputElement}>
                <RuleWorkTextField
                    outsideLabel={"Select type of classifier"}
                    select={true}
                    {...TextFieldProps}
                    {...other}
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
    CircleHelperProps: PropTypes.object,
    disabledChildren: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    TextFieldProps: PropTypes.object,
    value: PropTypes.string,
};

export default TypeOfClassifierSelector;