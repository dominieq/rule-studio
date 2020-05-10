import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../../../../Utils/Feedback/CircleHelper";
import CustomTextField from "../../../../Utils/Inputs/CustomTextField";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./styles/Calculations.module.css";

const tooltip = {
    main: " is responsible for classification of each object using induced decision rules that match the object, " +
        "and for handling the situation when no rule matches the object. Available classifiers:",
    simpleRuleClassifier: " - takes into account separately at least and at most rules. " +
        "If all rules covering classified object are of the same type (at least or at most), " +
        "then calculates intersection of decisions and chooses the most prudent one. " +
        "E.g. for decisions “class \u2265 medium” and “class \u2265 good”, the intersection is “class \u2265 good”, " +
        "and the most prudent decision is “good”. Analogically, for decisions “class \u2264 low” and “class \u2264 medium”, " +
        "the intersection is “class \u2264 low”, and the most prudent decision is “low”. " +
        "If there are covering rules of both types, then calculates most prudent decisions separately for covering rules of each type, " +
        "and then calculates class being an average of the resulting two prudent decisions (“in the middle” between these decisions), " +
        "rounding up if necessary.",
    simpleOptimizingCountingRuleClassifier: " - works as “Simple Rule Classifier (avg)” classifier, " +
        "but if there are covering rules of both types, instead of calculating an average of the two prudent decisions, " +
        "chooses one of these decisions, which is more supported by the objects from the rule’s learning (training) information table. " +
        "The support of a prudent decision is calculated as the number of training objects " +
        "that are covered by at least one rule of respective type and have that decision.",
    scoringRuleClassifierScore: " - employs measure Score(X,z) to evaluate degree of certainty of membership " +
        "of classified object z to decision class X. Chooses class X inducing the highest score. " +
        "This classifier has been described in the research paper: " +
        "Błaszczyński, J., Greco, S., Słowiński, R., Multi-criteria classification - " +
        "A new scheme for application of dominance-based decision rules. " +
        "European Journal of Operational Research, 181(3), 2007, pp. 1030-1044.",
    scoringRuleClassifierHybrid: " - works as “Simple Rule Classifier (avg)” if all rules covering classified object z " +
        "are of the same type (at least or at most). " +
        "If covering rules are of both types, works as “Scoring Rule Classifier”."
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
    maxWidth: {
        maxWidth: 360
    },
    paragraph: {
        margin: 0,
        textAlign: "justify"
    }
}, {name: "MultiRow"});

function TypeOfClassifierSelector(props) {
    const { CircleHelperProps, TextFieldProps: { disabledChildren, ...other } } = props;
    const classes = useStyles();

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper} style={props.style}>
            <CircleHelper
                multiRow={true}
                title={
                    <React.Fragment>
                        <p aria-label={"main"} className={classes.paragraph}>
                            <b>Classifier</b>
                            {tooltip.main}
                        </p>
                        <p aria-label={"classifier-one"} className={classes.paragraph}>
                            <b>Simple Rule Classifier (avg)</b>
                            {tooltip.simpleRuleClassifier}
                        </p>
                        <p aria-label={"classifier-two"} className={classes.paragraph}>
                            <b>Simple Rule Classifier (mode)</b>
                            {tooltip.simpleOptimizingCountingRuleClassifier}
                        </p>
                        <p aria-label={"classifier-three"} className={classes.paragraph}>
                            <b>Scoring Rule Classifier</b>
                            {tooltip.scoringRuleClassifierScore}
                        </p>
                        <p aria-label={"classifier-four"} className={classes.paragraph}>
                            <b>Hybrid Scoring Rule Classifier</b>
                            {tooltip.scoringRuleClassifierHybrid}
                        </p>
                    </React.Fragment>
                }
                TooltipProps={{
                    classes: { multiRow: classes.maxWidth },
                    placement: "right-start"
                }}
                WrapperProps={{
                    style: { marginRight: 16 }
                }}
                {...CircleHelperProps}
            />
            <div aria-label={"inner wrapper"} className={styles.InnerWrapper}>
                <CustomTextField
                    outsideLabel={"Select type of classifier"}
                    select={true}
                    {...other}
                >
                    {classifiers.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </CustomTextField>
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
