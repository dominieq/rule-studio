import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../../../../Utils/Feedback/CircleHelper";
import CustomTextField from "../../../../Utils/Inputs/CustomTextField";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./styles/Calculations.module.css";

const tooltip = {
    main: "Default classification result is returned by the selected classifier if no rule matches classified object. " +
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

function DefaultClassificationResultSelector(props) {
    const { CircleHelperProps, TextFieldProps: { disabledChildren, ...other } } = props;
    const classes = useStyles();

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper}>
            <CircleHelper
                multiRow={true}
                title={
                    <React.Fragment>
                        <p className={classes.paragraph}>
                            {tooltip.main}
                        </p>
                        <p className={classes.paragraph}>
                            <b>Majority decision class</b>
                            {tooltip.majorityDecisionClass}
                        </p>
                        <p className={classes.paragraph}>
                            <b>Median decision class</b>
                            {tooltip.medianDecisionClass}
                        </p>
                    </React.Fragment>
                }
                TooltipProps={{
                    placement: "right-start",
                    PopperProps: { disablePortal: false }
                }}
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
