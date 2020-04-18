import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { calculationStyles } from "./styles";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
import MenuItem from "@material-ui/core/MenuItem";

const tooltip = {
    main: "Classifier is responsible for classification of each object using induced decision rules that match the object, " +
        "and for handling the situation when no rule matches the object. Available classifiers:",
    simpleRuleClassifier: " - ",
    simpleOptimizingCountingRuleClassifier: " - ",
    scoringRuleClassifierScore: " - ",
    scoringRuleClassifierHybrid: " - "
};

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

const useStyles = makeStyles({
    paragraph: {
        margin: 0,
        textAlign: "justify"
    }
}, {name: "multi-row-tooltip"});

function TypeOfClassifierSelector(props) {
    const { CircleHelperProps, id, TextFieldProps, ...other } = props;
    const calculationClasses = calculationStyles();
    const classes = useStyles();

    return (
        <div id={id} className={calculationClasses.drawerRow}>
            <CircleHelper
                multiRow={true}
                title={
                    <React.Fragment>
                        <p className={classes.paragraph} id={"main"}>
                            {tooltip.main}
                        </p>
                        <p className={classes.paragraph} id={"simple-rule-classifier"}>
                            <b>Simple Rule Classifier (avg)</b>
                            {tooltip.simpleRuleClassifier}
                        </p>
                        <p className={classes.paragraph} id={"simple-optimizing-counting-rule-classifier"}>
                            <b>Simple Rule Classifier (mode)</b>
                            {tooltip.simpleOptimizingCountingRuleClassifier}
                        </p>
                        <p className={classes.paragraph} id={"scoring-rule-classifier-score"}>
                            <b>Scoring Rule Classifier</b>
                            {tooltip.scoringRuleClassifierScore}
                        </p>
                        <p className={classes.paragraph} id={"scoring-rule-classifier-hybrid"}>
                            <b>Hybrid Scoring Rule Classifier</b>
                            {tooltip.scoringRuleClassifierHybrid}
                        </p>
                    </React.Fragment>
                }
                TooltipProps={{
                    placement: "right-start",
                    PopperProps: {
                        disablePortal: true
                    }
                }}
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