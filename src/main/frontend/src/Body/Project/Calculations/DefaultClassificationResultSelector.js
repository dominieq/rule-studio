import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../../../Utils/Feedback/CircleHelper";
import CustomTextField from "../../../Utils/Inputs/CustomTextField";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./styles/Calculations.module.css";

const tooltip = {
    main: " is returned by the selected classifier if no rule matches classified object. " +
        "Available methods of determining default classification result:",
    majorityDecisionClass: " -  if no rule matches classified object, " +
        "then suggested decision is the most frequent class in the training data set",
    medianDecisionClass: " - if no rule matches classified object, " +
        "then suggested decision is the median decision class in the distribution " +
        "of ordered decision classes observed in the training data set."
};

const classificationResults = [
    {
        label: "Majority decision class",
        value: "majorityDecisionClass"
    },
    {
        label: "Median decision class",
        value: "medianDecisionClass"
    }
];

const useStyles = makeStyles({
    paragraph: {
        margin: 0,
        textAlign: "justify"
    }
}, {name: "MultiRow"});

/**
 * <h3>Overview</h3>
 * Presents default classification results and allows user to choose between values.
 *
 * @name DefaultClassificationResult
 * @constructor
 * @category Project
 * @subcategory Calculations
 * @param {Object} props
 * @param {Object} props.CircleHelperProps - Props applied to the {@link CircleHelper} element.
 * @param {Object} props.TextFieldProps - Props applied to the {@link CustomTextField} element.
 * @returns {React.ReactElement}
 */
function DefaultClassificationResultSelector(props) {
    const { CircleHelperProps, TextFieldProps: { disabledChildren, ...other } } = props;
    const classes = useStyles();

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper} style={props.style}>
            <CircleHelper
                multiRow={true}
                title={
                    <React.Fragment>
                        <p aria-label={"main"} className={classes.paragraph}>
                            <b>Default classification result</b>
                            {tooltip.main}
                        </p>
                        <p aria-label={"result-one"} className={classes.paragraph}>
                            <b>Majority decision class</b>
                            {tooltip.majorityDecisionClass}
                        </p>
                        <p aria-label={"result-two"} className={classes.paragraph}>
                            <b>Median decision class</b>
                            {tooltip.medianDecisionClass}
                        </p>
                    </React.Fragment>
                }
                WrapperProps={{
                    style: { marginRight: 16 }
                }}
                {...CircleHelperProps}
            />
            <div aria-label={"inner wrapper"} className={styles.InnerWrapper}>
                <CustomTextField
                    outsideLabel={"Select default classification result"}
                    select={true}
                    {...other}
                >
                    {classificationResults.map((result, index) => (
                        <MenuItem key={index} value={result.value}>
                            {result.label}
                        </MenuItem>
                    ))}
                </CustomTextField>
            </div>
        </div>
    )
}

DefaultClassificationResultSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    TextFieldProps: PropTypes.shape({
        disabledChildren: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func,
        value: PropTypes.string
    })
};

export default DefaultClassificationResultSelector;
