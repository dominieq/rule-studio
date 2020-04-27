import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./styles/Calculations.module.css";

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
    const { CircleHelperProps, TextFieldProps: { disabledChildren, ...other } } = props;
    const classes = useStyles();

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper}>
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
            <div aria-label={"inner wrapper"} className={styles.InnerWrapper}>
                <RuleWorkTextField
                    outsideLabel={"Select type of classifier"}
                    select={true}
                    {...other}
                >
                    {classifiers.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </RuleWorkTextField>
            </div>
        </div>
    )
}

TypeOfClassifierSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    TextFieldProps: PropTypes.shape({
        disabledChildren: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func,
        value: PropTypes.string
    })
};

export default TypeOfClassifierSelector;