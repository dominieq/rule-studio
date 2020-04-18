import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { calculationStyles } from "./styles";
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";

const tooltip = {
    main: "Default classification result is returned by the selected classifier if no rule matches classified object. " +
        "Available methods of determining default classification result:",
    majorityDecisionClass: " - ",
    medianDecisionClass: " - "
};

const useStyles = makeStyles({
    paragraph: {
        margin: 0,
        textAlign: "justify"
    }
}, {name: "multi-row-tooltip"});

function DefaultClassificationResultSelector(props) {
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
                        <p className={classes.paragraph} id={"majority-decision-class"}>
                            <b>Majority decision class</b>
                            {tooltip.majorityDecisionClass}
                        </p>
                        <p className={classes.paragraph} id={"median-decision-class"}>
                            <b>Median decision class</b>
                            {tooltip.medianDecisionClass}
                        </p>
                    </React.Fragment>
                }
                TooltipProps={{
                    placement: "right-start",
                    PopperProps: {
                        disablePortal: false
                    }
                }}
                WrapperProps={{
                    style: {marginRight: 16}
                }}
                {...CircleHelperProps}
            />
            <RuleWorkSmallBox className={calculationClasses.inputElement}>
                <RuleWorkTextField
                    id={id}
                    outsideLabel={"Select default classification result"}
                    select={true}
                    {...TextFieldProps}
                    {...other}
                >
                    {["majorityDecisionClass", "medianDecisionClass"]}
                </RuleWorkTextField>
            </RuleWorkSmallBox>
        </div>
    )
}

DefaultClassificationResultSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    disabledChildren: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    TextFieldProps: PropTypes.object,
    value: PropTypes.string,
};

export default DefaultClassificationResultSelector;